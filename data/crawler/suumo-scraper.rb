require 'pry'
require 'json'
require 'nokogiri'

class Cassette
  attr_accessor :place, :floor_plan, :rent, :area

  def initialize(place, floor_plan, rent, area)
    @place = place
    @floor_plan = floor_plan
    @rent = rent
    @area = area
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
      rent = row.css('td')[3].content.to_f
      floor_plan = row.css('td')[6].content
      area = row.css('td')[7].content.to_f

      cassettes << Cassette.new(place, floor_plan, rent, area)
    end
  end
end

results = { }

cassettes.each do |cassette|
  results[cassette.place] = [] unless results[cassette.place]
  results[cassette.place] << {
    place: cassette.place,
    plan: cassette.floor_plan,
    rent: cassette.rent,
    area: cassette.area
  }
end

pp results.to_json

STDERR.puts "Output #{cassettes.size} datasets"
