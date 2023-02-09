import numpy as np
import json
import pandas as pd
import time

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
        self.open = True
        self.order_num_gen = order_id()

    def create_order(self, start_time):
        id = self.order_num_gen.__next__()
        toppings, num_of_toppings = self.get_toppings()
        order_time_length = self.get_order_time_length()
        new_order =  order(id, num_of_toppings, toppings, start_time, order_time_length, self)
        return new_order


    def get_order_time_length(self):
        return np.random.normal(self.average_order_time, self.std_order_time)
    
    def get_toppings(self):
        num_of_toppings = np.random.choice([0,1,2], 1, p= self.num_of_topping_dist)
        toppings = np.random.choice(TOPPINGS, size= num_of_toppings,p= self.toppings_dist, replace= False)
        return (toppings, num_of_toppings)
    
    def open(self):
        self.open= True
    
    def close(self):
        self.open = False
    
    def is_open(self):
        return self.open


class order:
    def __init__(self, id, num_of_toppings,toppings, time, order_time_length, branch ) -> None:
        self.id = id
        self.num_of_toppings = num_of_toppings
        self.toppings = toppings
        self.time = time
        self.order_time_length = order_time_length
        self.branch = branch
    
    def order_to_json(self):
        pass