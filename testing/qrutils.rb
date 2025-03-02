# frozen_string_literal: true

require_relative 'config.rb'
require_relative 'browsermgmt'

DECODE_URL = 'w/decode.jspx'
DECODE_BASE = 'https://zxing.org'

module WebTestUtils

  # @param [String] imgfile name of a PNG file containing a
  #    QR code image
  # @return [String] value decoded from QR, if any
  def self.decode_qr(connections, imgfile)
    puts "in decode qr: #{imgfile}"
    imgpath = File.expand_path(imgfile)
    puts "path: #{imgpath}"
    qrcxn = connections.for('qrdecode')
    puts '1. got qr cxn'
    qrcxn.set_base_url(DECODE_BASE)
    qrcxn.nav_to(DECODE_URL)
    puts '2. nav to url'
    fileload = qrcxn.get_ext_element(:xpath, '//input[@id="f"]')
    puts "3. got load button: #{fileload}"
    fileload.send_keys(imgpath)
    puts '4. send keys done'
    filesubs = qrcxn.get_ext_elements(:xpath, '//input')
    puts "4a. got buttons: #{filesubs}"
    filesub = filesubs[-1]
    puts "5. got submit button: #{filesub}"
    filesub.click
    puts '6. clicked'
    sleep 1
    qrcxn.get_ext_element(:xpath, '//table[@id="result"]')
    puts '7. got result table'
    txt = qrcxn.get_ext_element(:xpath, '//pre').text
    puts "8. text is #{txt}"
    txt
  end

end
