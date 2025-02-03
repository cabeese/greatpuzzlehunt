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
  
  describe "Donation tests #{browser}" do
    include WebTestUtils
    
    before do
      @reqbrowser = browser
      set_base_url TESTCONFIG[:site]
      start_server(@reqbrowser, false, false, false)
    end

    after do
      shutdown_server
    end

    it 'donate button on user profile page' do
      # ensure registration is turned on
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin
      admin.turn_on_registration
      
      # do registration
      puts '1. create new user'
      fn, ln, em, pw, user = create_user(:student, :inperson)
      admin.mark_user_as_verified(fn, ln, em)

      puts '2. log in user'
      user.succeed_login_as(em, pw)

      puts '3. check that donate button is on profile'
      user.nav_to_profile
      sleep 0.5
      b = user.get_ext_element(:xpath, '//a[text()="Donate Online"]')
      refute_nil b

      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end

    it 'donate buttons on front page' do
      user = @connections.for('user')
      user.nav_to_home
      sleep 0.5

      puts '1. first donate button'
      b = user.get_ext_element(:xpath, '//a[text()="Donate"]')
      refute_nil b

      puts '2. second donate button'
      b = user.get_ext_element(:xpath, '//a[text()="Donate Online"]')
      refute_nil b
    end

    it 'donate buttons on FAQ page' do 
      user = @connections.for('user')
      user.nav_to('faq')
      sleep 0.5

      blist = user.get_ext_elements(:xpath, '//a[text()="Donate Online"]')
      refute_nil blist
      assert_equal 3, blist.length
    end

  end
end

each_browser x
