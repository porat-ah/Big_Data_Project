from pizza_simulator import *
import time
from pizza_simulator_producer import *
import numpy as np

def branch_generator(loc, id ,name):
    average_order_time= np.random.randint(3, 5, size= 1)[0]
    std_order_time= 1 #np.random.randint(.2, .7, size= 1)[0]
    toppings_dist= np.random.randint(0, 100, size= 6)
    toppings_dist = toppings_dist/ (toppings_dist.sum())
    num_of_topping_dist= np.random.randint(0, 100, size= 3)
    num_of_topping_dist = num_of_topping_dist/(num_of_topping_dist.sum())
    return branch(loc, id ,name ,average_order_time, std_order_time, toppings_dist, num_of_topping_dist)

def main():
    producer = init_kafka()
    sm = simulation_manager()
    branches_north = [('North', 1 ,'Metula'), ('North', 2 ,'Kiryat Shmona'),('North', 3 ,'kfar blum'),('North', 4 ,'ramot naftali'),('North', 5 ,'rosh pinah')]
    branches_haifa = [
        ('Haifa', 6, 'Haifa_1'), ('Haifa', 7, 'Haifa_2'),('Haifa', 8, 'Hadera'),('Haifa', 9, 'Harish'),
        ('Haifa', 10, 'Kiryat Ata'),('Haifa', 11, 'Kiryat Bialik'),('Haifa', 12, 'Kiryat Motzkin'),('Haifa', 13, 'Tirat Carmel')
        ]
    branches_dan = [
        ('Dan', 14, 'Tel Aviv_1'), ('Dan', 15, 'Tel Aviv_2'), ('Dan', 16, 'Tel Aviv_3') ,('Dan', 17, 'Rishon LeZion_1') ,('Dan', 18, 'Rishon LeZion_2'),
        ('Dan', 19, 'Ashdod_1'), ('Dan', 20, 'Ashdod_2') ,('Dan', 21, 'Bnei Brak') ,('Dan', 22, 'Holon') ,('Dan', 23, 'Ramat Gan')
     ]
    branches_central = [
        ('Central', 24, 'HaSharon_1') ,('Central', 25, 'HaSharon_2') ,('Central', 26, 'Petah Tikva_1') ,('Central', 27, 'Petah Tikva_2') ,('Central', 28, 'Ramla_1'),
        ('Central', 29, 'Ramla_2') ,('Central', 30, 'Rehovot_1') ,('Central', 31, 'Rehovot_2') ,('Central', 32, 'Kfar Saba') ,('Central', 33, 'Netanya')
        ]
    branches_south = [
        ('South', 34, 'Beersheba_1'), ('South', 35, 'Beersheba_2'),('South', 36, 'Arad'),('South', 37, 'Dimona'),
        ('South', 38, 'Eilat'),('South', 39, 'Kiryat Gat'),('South', 40, 'Kiryat Malakhi')
        ]
    branches = branches_north + branches_haifa + branches_dan + branches_central + branches_south
    for b in branches:
        if b[0] == 'North':
            _open = np.random.randint(9, 12, size= 1)[0]
            _close = np.random.randint(21, 23, size= 1)[0]
            order_prob = np.random.normal(.3, 0.1, size= 1)[0]
        elif b[0] == 'Haifa':
            _open = np.random.randint(8, 10, size= 1)[0]
            _close = np.random.randint(20, 22, size= 1)[0]
            order_prob = np.random.normal(.5, 0.2, size= 1)[0]
        elif b[0] == 'Dan':
            _open = np.random.randint(6, 9, size= 1)[0]
            _close = np.random.randint(21, 23, size= 1)[0]
            order_prob = np.random.normal(.7, 0.3, size= 1)[0]
        elif b[0] == 'Central':
            _open = np.random.randint(7, 10, size= 1)[0]
            _close = np.random.randint(20, 22, size= 1)[0]
            order_prob = np.random.normal(.6, 0.2, size= 1)[0]
        else:
            _open = np.random.randint(5, 9, size= 1)[0]
            _close = np.random.randint(19, 22, size= 1)[0]
            order_prob = np.random.normal(.4, 0.2, size= 1)[0]
        order_prob = min(max(0.1, order_prob), 0.9)
        b = branch_generator(b[0], b[1], b[2])
        sm.create_branch(opening_time=datetime.time(_open, 0),closing_time= datetime.time(_close,0), branch= b, order_prob= order_prob, producer= producer)
    
    while(True):
        sm.run_simulation(datetime.datetime.now(), producer)
        time.sleep(5)

if __name__ == "__main__":
    main()