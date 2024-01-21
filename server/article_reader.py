from requests_html import HTMLSession
from functools import reduce
import sys

def springer_link_handler(session, answer):
  second_answer = session.get(answer.url + "/metrics")
  spans = second_answer.html.find("span.app-article-metrics-stat__item")
  accesses = int(reduce(lambda x,y: (x+y) if y.isdigit() else x , spans[0].text))
  citations = int(reduce(lambda x,y: (x+y) if y.isdigit() else x , spans[1].text))

  return citations, accesses

def mdpi_handler(session, answer):
  cit_span = answer.html.find("span.citations-number")[0]
  citations = int(cit_span.text)

  acs_span = answer.html.find("span.view-number")[0]
  accesses = int(acs_span.text)

  return citations, accesses

sites_types_dictionary = {
  "www.mdpi.com" : mdpi_handler,
  "link.springer.com" : springer_link_handler
}

def get_site(url_text):
  site_start = url_text.find("//")+2
  site_end = url_text.find("/", site_start)
  return url_text[site_start:site_end]



def load_data_from_doi(doi):
  session = HTMLSession()
  answer = session.get(doi)
  site = get_site(answer.url)
  answer.html.render(timeout=60)  # this call executes the js in the page
  if site in sites_types_dictionary.keys():
    citations_number, accesses_number = sites_types_dictionary[site](session, answer)
    print(f"{citations_number} {accesses_number}")
  else:
    print("")

if __name__ == '__main__':
  doi = sys.argv[1]
  load_data_from_doi(doi)