import numpy as np
import json
import pandas as pd
import datetime
from pizza_simulator_producer import *

TOPPINGS = ['olive', 'mushrooms', 'corn', 'onion', 'tuna', 'jalapeno']


class order_id:
    num = 0

    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(order_id, cls).__new__(cls)
        return cls.instance
    
    def __next__(self):
        out = self.num
        self.num += 1
        return out


class branch:
    def __init__(self, loc, branch_id, name, average_order_time, std_order_time, toppings_dist, num_of_topping_dist) -> None:
        self.loc = loc
        self.branch_id = branch_id
        self.name = name
        self.average_order_time = average_order_time
        self.std_order_time = std_order_time
        self.toppings_dist = toppings_dist
        self.num_of_topping_dist = num_of_topping_dist
        self._open = True
        self.order_num_gen = order_id()

    def create_order(self, start_time):
        id = self.order_num_gen.__next__()
        toppings, num_of_toppings = self.get_toppings()
        order_time_length = int(self.get_order_time_length())
        new_order =  order(id, num_of_toppings, toppings, start_time, order_time_length, self)
        return new_order


    def get_order_time_length(self):
        return np.random.normal(self.average_order_time, self.std_order_time)
    
    def get_toppings(self):
        num_of_toppings = np.random.choice([0,1,2], 1, p= self.num_of_topping_dist)
        toppings = np.random.choice(TOPPINGS, size= num_of_toppings,p= self.toppings_dist, replace= False)
        return (list(toppings), int(num_of_toppings[0]))
    
    def open(self):
        self._open= True
        return json.dumps({
            "message_type": "branch status",
            "branch_id" : self.branch_id,
            "branch_name": self.branch.name,
            "status": "open",
        })
    
    def close(self):
        self._open = False
        return json.dumps({
            "message_type": "branch status",
            "branch_id" : self.branch_id,
            "branch_name": self.branch.name,
            "status": "close",
        })
    
    def is_open(self):
        return self._open




class order:
    def __init__(self, id, num_of_toppings,toppings, time, order_time_length, branch ) -> None:
        self.id = id
        self.num_of_toppings = num_of_toppings
        self.toppings = toppings
        self.time = time
        self.order_time_length = order_time_length
        self.branch = branch
        self.sent_count = 0
    
    def order_to_json(self):
        order_status = "in_process" if self.is_order_in_process() else "finished"
        if (self.sent_count == 1 and order_status == "in_process") or (self.sent_count >= 2 ):
            return 
        _order = json.dumps({
            "message_type": "order",
            "id": self.id,
            "branch_id" : self.branch.branch_id,
            "branch_name": self.branch.name,
            "location": self.branch.loc,
            "time": str(self.time),
            "order_status": order_status,
            "number_of_toppings": self.num_of_toppings,
            "toppings": self.toppings
        })
        self.sent_count += 1
        return _order
    
    def is_order_in_process(self):
        return self.time + datetime.timedelta(minutes= self.order_time_length) >  datetime.datetime.now()




class simulation_manager:
    def __init__(self) -> None:
        self.branches = []
        self.orders = []
    
    def create_branch(self, opening_time, closing_time, branch, order_prob, producer):
        _branch_meta_data = branch_meta_data(branch, opening_time, closing_time, order_prob)
        self.branches.append(_branch_meta_data)
        mes = json.dumps({
            "message_type": "branch created",
            "branch_id" : branch.branch_id,
            "branch_name": branch.name
        })
        produce(mes, producer)

    def run_simulation(self,time, producer): 
        for branch in self.branches:
            produce(self.close_open(branch, time), producer)
            if branch.branch.is_open():
                num_of_orders = np.random.choice([0, 1 ,2 ,3], size= 1, p= [.6, .25, .1,.05])
                orders_to_create = self.num_of_orders_to_create(branch, num_of_orders)
                for b in orders_to_create:
                    if b:
                        self.orders.append(branch.branch.create_order(time))
        orders_to_delete =[]
        for order in self.orders:
            if order.sent_count == 2:
                orders_to_delete.append(order)
            else:
                produce(order.order_to_json(), producer)
        for order in orders_to_delete:
            self.orders.remove(order)


    def close_open(self, branch, time):
        closing = time.replace(hour=branch.closing_time.hour, minute=branch.closing_time.minute, second=0, microsecond=0)
        opening = time.replace(hour=branch.opening_time.hour, minute=branch.opening_time.minute, second=0, microsecond=0)
        if time > closing and branch.branch.is_open():
            return branch.branch.close()
        elif time > opening and (not branch.branch.is_open()):
            return branch.branch.open()
        else:
            return None


    def num_of_orders_to_create(self, branch, num):
        return np.random.choice([True, False], size= num, p= [branch.order_prob, 1- branch.order_prob])





class branch_meta_data:
    def __init__(self, branch, opening_time, closing_time, order_prob) -> None:
        self.branch = branch
        self.opening_time = opening_time
        self.closing_time = closing_time
        self.order_prob = order_prob