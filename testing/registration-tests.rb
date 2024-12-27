# frozen_string_literal: true

require 'minitest/spec'
require 'securerandom'
require 'selenium-webdriver'

require_relative 'adminutils'
require_relative 'config'
require_relative 'webutils'

Minitest.seed = 1234

x = proc do |browser|
  describe "User registration tests #{browser}" do
    include WebTestUtils
    
    before do
      @reqbrowser = browser
      set_base_url TESTCONFIG[:site]
      start_server(@reqbrowser, false, true)
      turn_on_registration
    end

    after do
      turn_off_registration
      shutdown_server
    end

    it 'has registration link on home page' do
      nav_to_home
      b = get_ext_element(:xpath, '//section[@id="home-registration"]')
      puts "found registration div: #{b}"
      refute_nil b
      b = get_ext_element(:xpath, '//a[@href="/register"]')
      puts "found register link: #{b}"
      refute_nil b
    end

    it 'will not create account for existing email' do
      nav_to_home
      nav_to_register
      fill_registration_form('Firstname', 'Lastname', TESTCONFIG[:adminuser],
                             :volunteer, 'abcdefghijklmnopq',
                             'abcdefghijklmnopq', :inperson,
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Email already exists')
      puts "email exists message: #{f}"
      refute_nil f
    end

    it 'creates new user account' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual, 
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Thank you for creating an account')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end

    it 'logs in admin user' do
      nav_to_home
      login_as(TESTCONFIG[:adminuser], TESTCONFIG[:adminpw])
      f = match_source('Account')
      refute_nil f
      f = match_source('Change Password')
      refute_nil f
    end
    
    it 'requires first name' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form('', ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your First Name')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires last name' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, '', em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your Last Name')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires password match' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijkx', :virtual,
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Passwords do not match')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires email address' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, '',
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your email')
      refute_nil f
    end
    
    it 'allows plus in email address' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      em = 'ab+' + em
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Thank you for creating an account')
      refute_nil f
    end
    
    it 'requires phone' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Phone number required for US and Canadian addresses')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'allows non-US phone' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '+1 31 202020', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'NL', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Thank you for creating an account')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires age' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your age')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires street address' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '', 'Someplace',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your address')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires city' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', '',
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your city')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires zip if us' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Zip code required for US addresses')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires valid zip if us' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             'ABC123', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Invalid Zip code format for a US address')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires postcode if canada' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '', 'NE', 'Canada', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Postal code required for Canadian addresses')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires valid postcode if canada' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '12345', 'NE', 'Canada', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Invalid postal code format for a Canadian address')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'allows postcode if not canada or us' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             'XYZZY', 'NE', 'Barbados', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Thank you for creating an account')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'does not require postcode if not canada or us' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '', 'NE', 'Barbados', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Thank you for creating an account')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires state if us' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '12345', nil, 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('State/province required for US and Canadian addresses')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires valid state if us' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '12345', 'XX', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('State/province required for US and Canadian addresses')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires province if canada' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             'V7B 1K6', nil, 'CAN', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('State/province required for US and Canadian addresses')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires valid province if canada' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             'V7B 1K6', 'XX', 'CAN', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('State/province required for US and Canadian addresses')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'does not require state if not canada or us' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '', '', 'Barbados', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Thank you for creating an account')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires emergency contact name' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '01234', 'NE', 'USA', nil, 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your emergency contact\'s name')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires emergency contact relationship' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '01234', 'NE', 'USA', 'Abcde Fghij', nil,
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your relationship to your emergency contact')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires emergency contact phone' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             nil, 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Emergency contact phone number required for US and Canadian addresses')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires plausible emergency contact phone' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             'ABC123-2345', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Valid emergency contact phone number required for US and Canadian addresses')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'allows non-US emergency contact phone' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '01234', 'NE', 'NL', 'Abcde Fghij', 'def',
                             '+22 04 11111', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Thank you for creating an account')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires emergency contact email' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', nil, true, true)
      submit_registration_form
      f = match_source('Please enter your emergency contact\'s email address')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires plausible emergency contact email' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'ABCD', true, true)
      submit_registration_form
      f = match_source('Please enter your emergency contact\'s email address')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'requires hold harmless checked' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, false)
      submit_registration_form
      f = match_source('You must accept the Acknowledgement of Risk')
      refute_nil f
      f = match_source(em)
      refute_nil f
    end
    
    it 'shows and hides the hold harmless text' do
      nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      fill_registration_form(fn, ln, em,
                             :volunteer, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '25', '10 Maple', CITY_MARKER,
                             '01234', 'NE', 'USA', 'Abcde Fghij', 'def',
                             '123-456-7890', 'abc@def.ghi', true, false)
      f = match_source('Show Agreement')
      refute_nil f
      s = get_ext_element(:xpath, '//a[@role="button"][text()="Show Agreement"]')
      s.click
      f = match_source('Hide Agreement')
      refute_nil f
      f = match_source('I hereby acknowledge that I have')
      refute_nil f
      f = match_source('text, email, phone, social media')
      refute_nil f
      s = get_ext_element(:xpath, '//a[@role="button"][text()="Hide Agreement"]')
      s.click
      f = match_source('Show Agreement')
      refute_nil f
    end
    
  end
end

each_browser x
