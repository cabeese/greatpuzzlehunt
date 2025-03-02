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
  
  describe "Gear tests #{browser}" do
    include WebTestUtils
    
    before do
      @reqbrowser = browser
      set_base_url TESTCONFIG[:site]
      start_server(@reqbrowser, false, false, false)
    end

    after do
      shutdown_server
    end

    it 'gear button on user profile page' do
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

      puts '3. check that gear button is on profile'
      user.nav_to_profile
      sleep 0.5
      b = user.get_ext_element(:xpath, '//a[text()="Buy Gear"]')
      refute_nil b

      # note: cannot test clicking on the gear button because it opens
      # a new page that we do not have access to. It appears Selenium
      # has magic to do this but not going to implement it today

      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end

    it 'gear buttons on front page' do
      user = @connections.for('user')
      user.nav_to_home
      sleep 0.5

      blist = user.get_ext_elements(:xpath, '//a[text()="Buy Gear"]')
      refute_nil blist
      assert_equal 2, blist.length
    end

    it 'gear buttons on FAQ page' do 
      user = @connections.for('user')
      user.nav_to('faq')
      sleep 0.5

      blist = user.get_ext_elements(:xpath, '//a[text()="Buy Gear"]')
      refute_nil blist
      assert_equal 2, blist.length
    end

  end
end

each_browser x
