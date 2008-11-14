#!/usr/bin/env ruby

require 'rubygems'
require 'erb'
require 'BlueCloth'

File.open(ARGV.shift) do |f|
  ERB.new(f.read).run
end
