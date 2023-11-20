from requests_html import HTMLSession
import sys

def springer_link_handler(session, answer):
  second_answer = session.get(answer.url + "/metrics")

  dls = second_answer.html.find("dl.c-article-metrics__access-citation")
  citations = int(dls[1].find("dt")[0].text) + int(dls[2].find("dt")[0].text)
  accesses = int(dls[0].find("dt")[0].text)

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