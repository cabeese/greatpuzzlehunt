# frozen_string_literal: true

require 'minitest/spec'
require 'securerandom'
require 'selenium-webdriver'

require_relative 'adminutils'
require_relative 'webutils'
require_relative 'config'

Minitest.seed = 1234

x = proc do |browser|
  # Safari does not support opening multiple browser webdriver sessions
  if browser == :safari
    next
  end
  
  describe "User creation tests #{browser}" do
    include WebTestUtils
    
    before do
      @reqbrowser = browser
      set_base_url TESTCONFIG[:site]
      start_server @reqbrowser
    end

    after do
      shutdown_server
    end

    it 'creates and activates new user account' do
      # ensure registration is turned on
      @adminbrowser = Selenium::WebDriver.for @reqbrowser
      nav_to_home(@adminbrowser)
      succeed_login_as_admin(@adminbrowser)
      turn_on_registration
      
      # do registration
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :student, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'Abc Defgh', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Thank you for creating an account')
      refute_nil f
      f = match_source(em)
      refute_nil f

      # check that the user was created
      nav_to('admin/users', @adminbrowser)

      # make sure the new user is listed on the users list page
      f = match_source("#{fn} #{ln}", @adminbrowser)
      refute_nil f
      f = match_source(em, @adminbrowser)
      refute_nil f
      sleep 2

      # make sure the user shows email is not verified
      emailtd  = get_ext_element(:xpath, "//td/span[text()='#{em}']", @adminbrowser)
      puts "emailtd: #{emailtd} text: #{emailtd.text}"
      refute_nil emailtd
      emailtdi = get_sub_element(emailtd, :class, 'icons')
      puts "emailtdi: #{emailtdi} text: #{emailtdi.text}"
      refute_nil emailtdi
      noicon = get_sub_element(emailtdi, :class, 'dont')
      puts "noicon: #{noicon} text: #{noicon.text}"
      refute_nil noicon

      emailicon = get_sub_element(emailtdi, :class, 'mail')
      puts "emailicon: #{emailicon}"
      refute_nil emailicon
                                    
      # get the "more..." button to see user details and actions
      morebutton = get_ext_element(:xpath, "//td/span[text()='#{em}']/../../td/button[text()='More']", @adminbrowser)
      puts "morebutton: #{morebutton} text: #{morebutton.text}"
      refute_nil morebutton

      # bring up the user details
      morebutton.click
      sleep 2

      # make sure that we have the details modal up
      f = match_source('Player Details', @adminbrowser)
      puts "player details: #{f}"
      refute_nil f
      sleep 2

      # verify the email address
      verifybutton = get_ext_element(:xpath, '//button[text()="Verify Email"]', @adminbrowser)
      puts "verify button: #{verifybutton} text: #{verifybutton.text}"
      verifybutton.click

      # close the modal
      closeicon = get_ext_element(:xpath, '//div/i[contains(@class, "close")]', @adminbrowser)
      puts "modal close: #{closeicon} text: #{closeicon.text}"
      closeicon.click
      sleep 4

      # make sure the email icon only is showing (no dont icon)
      emailtd  = get_ext_element(:xpath, "//td/span[text()='#{em}']", @adminbrowser)
      puts "emailtd: #{emailtd} text: #{emailtd.text}"
      refute_nil emailtd
      emailicon = get_sub_element(emailtd, :class, 'mail')
      puts "emailicon: #{emailicon}"
      refute_nil emailicon
      green = get_sub_element(emailtd, :class, 'green')
      puts "green: #{green}"
      refute_nil green

      sleep 4

      # clean up
      turn_on_registration
      @adminbrowser.quit
    end
  end
end

# Safari does not support opening two parallel sessions to 
each_browser x
