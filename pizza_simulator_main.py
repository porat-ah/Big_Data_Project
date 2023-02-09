from pizza_simulator import *
import time

def main():
    sm = simulation_manager()
    b = branch('n', 1,'n_1', 20, 2, [.25, .25, .15,.2, .05, .1], [.3, .5, .2])
    sm.create_branch(opening_time=datetime.time(10, 0),closing_time= datetime.time(21,0), branch= b, order_prob= .8)
    while(True):
        sm.run_simulation(datetime.datetime.now())
        time.sleep(59)

if __name__ == "__main__":
    main()