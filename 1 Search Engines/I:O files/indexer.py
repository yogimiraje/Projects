#-------------------------------------------------------------------------------
# This program creates simple inverted index of the given corpus.
# Inverted index is in the format :
# (docid, tf), (docid, tf), .....
# Input: Corpus file
# Output : File containing simple inverted index and token count of each
# document
#-------------------------------------------------------------------------------
import sys
import re
import json

def main():

    if len(sys.argv) == 3:
        input_file = str(sys.argv[1])
        output_file = str(sys.argv[2])
        Error = False
    else:
        Error = True
        print " No. of given arguments are incorrect"

    if not Error:
       build_inverted_index(input_file,output_file)


def build_inverted_index(input_file,output_file):

    doc_token_count = {}            # dictionary to store the token counts for
                                    # each doc_id.
                                    # Key : doc_id, value
                                    # no. of tokens in each doc

    doc_token_collection = {}       # collections of all the tokens

    temp = {}                       # a temporary dictionary

    inverted_index = {}             # dictionary to store inverted index
                                    # key: word, value : tf_single_word for key

    ds = []                         # data structure to dump json

    # Read the file and create a list of tokenized document.
    # New Documents starts with a '#' character
    with open(input_file,"r") as f:
        text = f.read()
        doc_list = re.split('\# ',text)
        number_of_docs = len(doc_list)

    # First item is empty that we do not need
    doc_list.pop(0)

    # Process each document in the doc_list
    for doc in doc_list:
         words = re.findall(r'\w+', doc)

         token_count = len(words) - 1
         # First word  is document ID
         doc_id = words[0]

         # Build the dictionary for token count
         doc_token_count[doc_id] = token_count

         # Build dictionary for token collection
         # pop the first word as it is NOT a token
         words.pop(0)
         doc_token_collection[doc_id] = words

    # Build inverted_index dict
    for doc_id,doc_words in doc_token_collection.iteritems():
        for a_word in doc_words :
            temp = {}
            if a_word in inverted_index:
                if doc_id in inverted_index.get(a_word):
                    # Increase the word count
                    inverted_index[a_word][doc_id] += 1
                else:
                    # doc_id occured first time,set count to 1
                    inverted_index[a_word][doc_id] = 1
            else:
                # word occuring for the first time, set temp dict
                temp[doc_id] = 1
                inverted_index[a_word] = temp


    op_file = open (output_file,'w')

    # Write the ds. First element is inverted_index and second is token_count
    ds = [inverted_index,doc_token_count]

    json.dump(ds,op_file,indent=4)

    op_file.close()

    print "Results written in " + output_file

if __name__ == '__main__':
    main()
