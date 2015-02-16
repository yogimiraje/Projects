#-------------------------------------------------------------------------------
# Name:  page_rank.py
# Purpose:  To calculate page rank on collection of web documents represented
# as page linked-pages.

# Input : a text file with web graph representation
#
# Output:  Top 50 pages by page ranks, Top 50 pages by in-link count
#
# Author:      Yogendra Miraje
#
# Created:     10/14/2014
#
# Copyright 2014, Yogendra Miraje, All rights reserved.
#-------------------------------------------------------------------------------
import sys
import math

def main():

    if len(sys.argv) == 2:
        input_file = str(sys.argv[1])
        Error = False
    else:
        Error = True
        print " No. of arguments incorrect"


    if not Error:
        # calculate_page_rank Function
        calc_page_ranks (input_file)


def calc_page_ranks(i_file):

 # Initialize constants

    # Dictionary to represent the web graph in the file
    # Key is each page in the web graph
    # Value is a list consisting of
    #  -- value[0] -> current PR
    #  -- value[1] -> temporary PR
    #  -- value[2] -> Number of inlinks
    #  -- value[3] -> Number of outlinks
    #  -- value[4:] -> All pages linked to key (without duplicates)

    wg = {}

    #Load file into dictionary :

    f= open(i_file,"r")
    for line in f:
        x=line.split()
        a=x[0]
        b=x[1:len(x)]
        b= list(set(b))

        wg[a] = b

        # current PR - value[0]
        b.insert(0,0)
        # temporary PR - value[1]
        b.insert(1,0)
        # Number of inlinks - value[2]
        b.insert(2,len(b)-2)
        # Number of outlinks - value[3]
        b.insert(3,0)

    n=len(wg)
    print 'Number of web pages: %s' % n
    N=float(n)

    PR0= 1/N


    # Update initial probability and number of outlinks
    for key,value in wg.iteritems():
        value[0]= PR0
        for q in value[4:]:
            value_q = wg.get(q)
            value_q[3] += 1

    apply_algorithm(wg,N)


def apply_algorithm(wg,N):

    # d is the PageRank damping/teleportation factor; use d = 0.85 as is typical
    d = 0.85

    i=0
    iterations=0
    last_prplxty = calculate_perplexity(wg)
    print 'Perplexity for iteration 0 : %s  ' % last_prplxty

    #  Run until convergence
    while i<4:

        sinkPR = 0
        newPR_p = 0

        for page, value in wg.iteritems():   # calculate total sink PR
            if(value[3] == 0):
                sinkPR += value[0]

        for page, value in wg.iteritems():

             newPR_p = (1-d)/N               # teleportation
             newPR_p += d*sinkPR/N           # spread remaining sink PR evenly

             for q in value[4:]:             # pages pointing to p
                value_q = wg.get(q)
                PR_q= value_q[0]
                L_q = value_q[3]

                newPR_p += d * PR_q/L_q      # add share of PageRank from in-links

             value[1]= newPR_p

        for page, value in wg.iteritems():
            value[0] = value[1]

        iterations += 1


        prplxty = calculate_perplexity(wg)
        print 'Perplexity for iteration %s : %s  ' % (iterations,prplxty)

        # Check if diffrenece between previous perplexity and current perplexity
        #  is less than 1. Loop will terminate after such 4 iterations

        if abs(last_prplxty - prplxty) < 1:
            i+=1

        last_prplxty = prplxty

    print_results(wg)


def calculate_perplexity(wd):

    perplexity = 0
    entropy = 0

    for k,v in wd.iteritems():
        entropy +=  (v[0] * (math.log(1/v[0],2)))

    perplexity = math.pow (2,entropy)

    return perplexity


def print_results(wg):

    PR= sorted([(v[0],k) for k, v in wg.iteritems()],reverse=True)
    InLinks = sorted([(v[2],k) for k, v in wg.iteritems()],reverse=True)
    m=0
    n=0
    print "\nTop 50 pages based on page ranks:"
    for k,v in PR:
        m+=1
        print "%s: %s" % (v, k)
        if(m==50):
            break

    print "\nTop 50 pages based on in-link count:"

    for k,v in InLinks:
        n+=1
        print "%s: %s" % (v,k)
        if(n==50):
            break

if __name__ == '__main__':
    main()


