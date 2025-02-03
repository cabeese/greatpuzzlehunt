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
  
  describe "User profile tests #{browser}" do
    include WebTestUtils
    
    before do
      @reqbrowser = browser
      set_base_url TESTCONFIG[:site]
      start_server(@reqbrowser, false, false, false)
    end

    after do
      shutdown_server
    end

    it 'can change password' do
      # ensure registration is turned on
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin
      admin.turn_on_registration
      
      # do registration
      user = @connections.for('user')
      user.nav_to_register
      fn, ln, em = gen_random_id
      puts "First name: #{fn}"
      puts "Last name: #{ln}"
      puts "Email: #{em}"
      user.fill_registration_form(fn, ln, em,
                             :student, 'abcdefghijk', 'abcdefghijk', :virtual,
                             '555-555-5555', '37', '10 Maple', CITY_MARKER,
                             '01234', 'NE', 'USA', 'Abc Defgh', 'def',
                             '123-456-7890', 'abc@def.ghi', true, true)
      user.submit_registration_form
      f = user.match_source('Thank you for creating an account')
      refute_nil f
      f = user.match_source(em)
      refute_nil f

      admin.mark_user_as_verified(fn, ln, em)

      user.succeed_login_as(em, 'abcdefghijk')
      user.change_password('ghijklmno')
      user.nav_to('logout')
      sleep 1

      user.succeed_login_as(em, 'ghijklmno')

      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end

  end
end
