require 'open-uri'
require 'fileutils'

BASE_URL = "http://suumo.jp"
SEARCH_PATH = "/jj/chintai/ichiran/FR301FC001"

def get_suumo_url(id, page)
  query = [
    "ar=030", "bs=040", "ta=13", "cb=0.0", "ct=9999999", "mb=0", "mt=9999999", "et=9999999", "cn=9999999",
    "shkr1=03", "shkr2=03", "shkr3=03", "shkr4=03", "sngz=", "po1=09", "pc=50", "pn=#{page}", "sc=131#{'%02d' % id}"
  ].join('&')

  "#{BASE_URL}#{SEARCH_PATH}/?#{query}"
end

100.times do |i|
  23.times do |j|
    url = get_suumo_url(j + 1, i + 1)
    puts "GET(#{Time.now}): #{url}"

    begin
      FileUtils.mv(open(url).path, "./html/#{j + 1}-#{i + 1}.html")
    rescue SocketError => e
      puts "BANNED(#{Time.now}): retry request"

      sleep 10
      retry
    end

    sleep 1
  end
end
