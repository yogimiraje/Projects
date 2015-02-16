#-------------------------------------------------------------------------------
#  Web crawling - Depth 3
#-------------------------------------------------------------------------------

import sys
import re
import time
import urllib
import urlparse
from bs4 import BeautifulSoup     # import beautifulsoap


def crawler(wikiurls,key_phrase):
    page_count = 0
    depth = 1
    child_urls =[]
    rel_pages = []

    seed_url = wikiurls[0]
    urls_found = [seed_url]

    # Filtering patterns
    pat1 = r'http://en.wikipedia.org/wiki/.*'
    pat2 = r'^http://.*(:+|#+).*'
    pat3 = r'http://en.wikipedia.org/wiki/Main_Page.*'


    if key_phrase =="":             # set parameters for Unfocused crawl
        relevant_page = True
        Unfocused = True
        Focused  =  False
        MAX_DEPTH = 2
    else:                           # set parameters for Focused crawl
        Focused = True
        Unfocused = False
        MAX_DEPTH = 3

    print " Please be patient. I am crawling...."

    while (len(wikiurls) > 0):

        time.sleep(1)

        # Request HTML page
        html_code = urllib.urlopen(wikiurls[0]).read()
        soup= BeautifulSoup(html_code)

        if Focused:
            kep = re.compile(key_phrase, re.IGNORECASE)
            temp_urls = soup.body.findAll(text=kep, limit=1)

            if len(temp_urls) > 0:
                relevant_page = True
                rel_pages.append(wikiurls[0])
            else:
                relevant_page = False

        wikiurls.pop(0)

        # Crawl the page only if it is relevant
        if relevant_page:
            for tag in soup.findAll('a',href=True):
                tag['href'] = urlparse.urljoin(seed_url,tag['href'])
                match_pat1 = re.match(pat1,tag['href'])
                not_match_pat2 = not (re.match(pat2,tag['href']))
                not_match_pat3 = not (re.match(pat3,tag['href']))

                if match_pat1 and not_match_pat2 and not_match_pat3:
                    if tag['href'] not in urls_found:
                        urls_found.append(tag['href'])
                        child_urls.append(tag['href'])

        # Preapare for next depth
        if len(wikiurls) == 0 and depth < MAX_DEPTH:
            wikiurls = child_urls[:]
            depth = depth + 1
            child_urls = []

    # Print the output
    if Focused:
       with open('list of urls.txt','w') as file:
        for item in rel_pages:
            print item
            print>>file, item
       print 'No.of pages for focused crawl:'
       print len(rel_pages)

    else:
        with open('list of urls.txt','w') as file:
            for item in urls_found:
                print item
                print>>file, item
        print 'No. of pages for Unfocused crawl :'
        print len(urls_found)


def main():

    if len(sys.argv) == 2: # Unfocused Crawling
        key_phrase =  ""
        Error = False
    elif len(sys.argv) == 3: # Focused Crawling
        key_phrase =  str(sys.argv[2])
        Error = False
    else:
        Error = True
        print " No. of arguments incorrect"


    if not Error:
        wikiurls = [str(sys.argv[1])]


        # Crawler Function
        crawler(wikiurls,key_phrase)

if __name__ == '__main__':
    main()



