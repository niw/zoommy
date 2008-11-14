#!/usr/bin/env ruby

require 'rexml/document'

version = File.read(ARGV.shift).strip

if(src_dir = ARGV.shift)
  xml = REXML::Document.new(`svn info --xml #{src_dir}`)
  revision = xml.root.get_elements('entry').first.attributes['revision']
  puts "#{version}-#{revision}"
else
  puts version
end
