# frozen_string_literal: true

require 'minitest/spec'
require 'securerandom'
require 'selenium-webdriver'

require_relative 'webutils'
require_relative 'config'

Minitest.seed = 1234

x = proc do |browser|
  describe "User registration tests #{browser}" do
    include WebTestUtils
    
    before do
      set_base_url TESTCONFIG[:site]
      start_server browser
    end

    after do
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
      b = get_ext_element(:xpath, '//a[@href="/register"]')
      puts "found register link: #{b}"
      refute_nil b
      b.click
      b = match_source('Create account for the')
      puts "found create account message: #{b}"
      refute_nil b
      fn = get_ext_element(:xpath, '//input[@name="firstname"]')
      ln = get_ext_element(:xpath, '//input[@name="lastname"]')
      m = get_ext_element(:xpath, '//input[@name="email"]')
      pw = get_ext_element(:xpath, '//input[@name="password"]')
      pw2 = get_ext_element(:xpath, '//input[@name="confirmPassword"]')
      sub = get_ext_element(:xpath, '//button[@type="submit"]')
      phone = get_ext_element(:xpath, '//input[@name="phone"]')
      age = get_ext_element(:xpath, '//input[@name="age"]')
      addr = get_ext_element(:xpath, '//input[@name="address"]')
      city = get_ext_element(:xpath, '//input[@name="city"]')
      zip = get_ext_element(:xpath, '//input[@name="zip"]')
      state = get_ext_element(:xpath, '//div[@name="state"]/input')
      country = get_ext_element(:xpath, '//input[@name="country"]')
      ecname = get_ext_element(:xpath, '//input[@name="ecName"]')
      ecrelationship = get_ext_element(:xpath, '//input[@name="ecRelationship"]')
      ecphone = get_ext_element(:xpath, '//input[@name="ecPhone"]')
      ecemail = get_ext_element(:xpath, '//input[@name="ecEmail"]')
      hh = get_ext_element(:xpath, '//input[@name="holdHarmless"]')
      refute_nil fn
      refute_nil ln
      refute_nil m
      refute_nil pw
      refute_nil pw2
      refute_nil sub
      refute_nil phone
      refute_nil age
      refute_nil addr
      refute_nil city
      refute_nil zip
      refute_nil state
      refute_nil country
      refute_nil ecname
      refute_nil ecrelationship
      refute_nil ecphone
      refute_nil ecemail
      refute_nil hh
      
      fn.send_keys('Firstname')
      ln.send_keys('Lastname')
      m.send_keys(TESTCONFIG[:adminuser])

      # select the non-student account type (cannot be done directly using
      # a selector because of how Semantic UI implements the drop down)
      @browser.action.send_keys(:tab).perform
      @browser.action.send_keys(:down).perform
      @browser.action.send_keys(:space).perform

      pw.send_keys('abcdefghijklmnopq')
      pw2.send_keys('abcdefghijklmnopq')
      phone.send_keys('555-555-5555')
      age.send_keys('37')
      addr.send_keys('10 Maple')
      city.send_keys('Someplace')
      zip.send_keys('01234')
      state.send_keys('NE')
      country.send_keys('USA')
      ecname.send_keys('A B')
      ecrelationship.send_keys('DEF')
      ecphone.send_keys('123-456-7890')
      ecemail.send_keys('abc@def.ghi')
      hh.send_keys(:space)

      sub.click

      f = match_source('Email already exists')
      puts "email exists message: #{f}"
      refute_nil f
    end

    it 'will not create for existing email 2' do
      nav_to_register
      fill_registration_form('Firstname', 'Lastname', TESTCONFIG[:adminuser],
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijkx',
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your 10 digit phone number')
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '+1 31 202020', '37', '10 Maple', 'Someplace',
                             '01234', 'NE', 'NL', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '', '10 Maple', 'Someplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '', 'Someplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', '',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             'ABC123', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '', 'NE', 'Canada', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '12345', 'NE', 'Canada', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             'XYZZY', 'NE', 'Barbados', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '', 'NE', 'Barbados', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '12345', nil, 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '12345', 'XX', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             'V7B 1K6', nil, 'CAN', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             'V7B 1K6', 'XX', 'CAN', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '', '', 'Barbados', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '01234', 'NE', 'USA', 'A B', nil,
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
                             nil, 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your emergency contact\'s phone number')
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
                             'ABC123-2345', 'abc@def.ghi', true, true)
      submit_registration_form
      f = match_source('Please enter your emergency contact\'s phone number')
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '01234', 'NE', 'NL', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
                             :volunteer, 'abcdefghijk', 'abcdefghijk',
                             '555-555-5555', '25', '10 Maple', 'Anyplace',
                             '01234', 'NE', 'USA', 'A B', 'def',
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
