#-------------------------------------------------------------------------------
# This program implement a small search engine using BM25 ranking model.
#
# Input: an inverted index of a corpus
#
# Output: Top 100 document IDs and their BM25 scores for each test query in
# the queries file in the following format:
# query_id Q0 doc_id rank BM25_score system_name
#
# Author:      Yogendra Miraje
#
# Created:     11/20/2014
#
# Copyright 2014, Yogendra Miraje, All rights reserved.
#-------------------------------------------------------------------------------
import sys
import json
import math
import collections

def main():

    if len(sys.argv) == 5:
        index_file = str(sys.argv[1])
        queries_file = str(sys.argv[2])
        max_resultant_docs = int(sys.argv[3])
        results_file = str(sys.argv[4])
        load_dict(index_file,queries_file,results_file,max_resultant_docs)
    else:
        print " No. of given arguments are incorrect"


def load_dict(index_file,queries_file,results_file,max_resultant_docs):
    # Dictionary to store bm25 scores
    # key : doc_id , value : bm25 score
    bm25 = collections.defaultdict(int)

    i_file = open(index_file, 'r')

    # load the inveted_index and token_count dictionaries from the file

    ds = json.load(i_file)
    inv_idx = ds[0]
    token_count = ds[1]

    i_file.close()

    with open (queries_file,'r') as f:
        queries = f.readlines()

    N = len(token_count)                   # total number of  documents

    total_no_of_tokens = sum(token_count.values())  # total no. of tokens

    avdl = total_no_of_tokens / float(N)   # average length of the document

    print "Total number of  documents: " + str(N)
    print "Total no. of tokens: " + str(total_no_of_tokens)
    print "Average length of the document: " + str(avdl)

    query_id = 0

    f = open(results_file,'w')

    for query in queries:
        query_id += 1
        # Empty bm25 dictionary for a fresh query
        bm25.clear()
        # Split the query into terms
        terms_in_query = query.split()
        # Calculate bm25 score for each document where the current term appears
        #  and accumulate the results for the term
        for term in terms_in_query:
            tf = inv_idx.get(term)
            for doc_id in tf:
                dl = token_count.get(doc_id)
                qfi = query.count(term)
                score = calc_bm25_score(doc_id,tf,N,avdl,dl,qfi)
                bm25[doc_id] += score

        # sort the bm25 dictionary and store into a list
        sorted_bm25 = sorted([(v,k) for k,v in bm25.iteritems()],reverse=True)

        output_result(sorted_bm25[0:max_resultant_docs],f,query_id)

    f.close()
    print "Results written in " + results_file


def calc_bm25_score(doc_id,tf_in_all_docs,N,avdl,dl,qfi):
    k1 = 1.2
    k2 = 100.0
    b = 0.75
    # total number of documents in which the term appears
    ni = len(tf_in_all_docs)

    K =  k1 * ((1-b) + (b*dl/avdl))

    fi = tf_in_all_docs.get(doc_id)

    p1 = 1/((ni+ 0.5)/(N-ni+0.5))
    p2 = (k1 + 1) * fi * (k2 + 1)
    p3 = (K + fi) * (k2 + qfi)

    # BM25 Score formula:
    score = math.log (p1) * p2/p3
    return score



def output_result(top_bm25_scores,f,query_id):
    rank = 0
    system_name = "YOGI"

    for score,doc_id in top_bm25_scores:
        rank += 1

        # Format the output
        line = str(query_id).center(10) +\
               "  Q0   ".center(10) +\
               str(doc_id).rjust(8) +\
               str(rank).rjust(8) +\
               str(score).rjust(20) +\
               system_name.center(16)

        f.write(line + "\n")

if __name__ == '__main__':
    main()


