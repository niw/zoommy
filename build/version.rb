#!/usr/bin/env ruby

require 'rexml/document'

version = File.read(ARGV.shift).strip

if(src_dir = ARGV.shift)
  if File.exist?(File.join(File.expand_path(src_dir), '.svn'))
    xml = REXML::Document.new(`svn info --xml #{src_dir}`)
    revision = xml.root.get_elements('entry').first.attributes['revision']
    version = "#{version}-#{revision}"
  elsif File.exists?(File.join(File.expand_path(src_dir), '.git'))
    hash = `cd '#{src_dir}' && git show --pretty='format:%H' HEAD`.split.first
    version = "#{version}-#{hash}"
  end
end
puts version
