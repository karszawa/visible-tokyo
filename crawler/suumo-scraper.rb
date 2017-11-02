require 'pry'
require 'nokogiri'

class Cassette
  attr_accessor :place, :floor_plan, :rent

  def initialize(place, floor_plan, rent)
    @place = place
    @floor_plan = floor_plan
    @rent = rent
  end
end

cassettes = []

Dir.open('./html').each do |file|
  next unless file.end_with?('.html')
  STDERR.puts "Processing #{file}"

  match_data = file.match(/(\d+)-(\d+)\.html$/)

  id = match_data[1]
  page = match_data[2]

  doc = Nokogiri.HTML(open("./html/#{file}"))

  doc.css(".cassetteitem").each do |item|
    place = item.css('.cassetteitem_detail-col1').first&.content

    item.css('.cassetteitem_other tbody tr').each do |row|
      rent = row.css('td')[3].content
      floor_plan = row.css('td')[6].content

      cassettes << Cassette.new(place, floor_plan, rent)
    end
  end
end

puts '{'

puts cassettes.map { |cassette|
  "{ place: \"#{cassette.place}\", floor_plan: \"#{cassette.floor_plan}\", rent: \"#{cassette.rent}\" }"
}.join(",\n")

puts '}'

STDERR.puts "Output #{cassettes.size} datasets"
