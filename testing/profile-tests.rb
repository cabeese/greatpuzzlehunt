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
  
  describe "Profile tests #{browser}" do
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
      puts '1. create new user'
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

      puts '2. logging in with original password'
      user.succeed_login_as(em, 'abcdefghijk')

      puts '3. changing password'
      user.change_password('ghijklmno')
      sleep 1

      puts '4. log out'
      @connections.close('user')
      user2 = @connections.for('user2')
      sleep 1

      puts '5. log in with new password'
      user2.nav_to_home
      user2.succeed_login_as(em, 'ghijklmno')

      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end

    it 'will not change password when no match' do
      # ensure registration is turned on
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin
      admin.turn_on_registration
      
      # do registration
      puts '1. create new user'
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

      puts '2. logging in with original password'
      user.succeed_login_as(em, 'abcdefghijk')

      puts '3. changing password to mismatch'
      user.change_password_2('ghijklmno', 'abcdefgh')
      sleep 1

      puts '4. error message about passwords'
      m = user.get_ext_element(:xpath, '//p[text()="Passwords do not match!"]')
      puts "got message: #{m}"
      refute_nil m

      puts '5. log out'
      @connections.close('user')
      user2 = @connections.for('user2')
      sleep 1

      puts '6. log in with old password'
      user2.nav_to_home
      user2.succeed_login_as(em, 'abcdefghijk')

      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end

    it 'will not change password when too short' do
      # ensure registration is turned on
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin
      admin.turn_on_registration
      
      # do registration
      puts '1. create new user'
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

      puts '2. logging in with original password'
      user.succeed_login_as(em, 'abcdefghijk')

      puts '3. changing password to mismatch'
      user.change_password('ghij')
      sleep 1

      puts '4. error message about passwords'
      m = user.get_ext_element(:xpath, '//p[text()="Password must be at least 6 characters long!"]')
      puts "got message: #{m}"
      refute_nil m

      puts '5. log out'
      @connections.close('user')
      user2 = @connections.for('user2')
      sleep 1

      puts '6. log in with old  password'
      user2.nav_to_home
      user2.succeed_login_as(em, 'abcdefghijk')

      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end

    it 'admin can change user email' do
      # ensure registration is turned on
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin
      admin.turn_on_registration
      
      # do registration
      puts '1. create new user'
      fn, ln, em, pw, user = create_user(:student, :inperson)
      puts "original email: #{em}"
      puts "pw: #{pw}"
      admin.mark_user_as_verified(fn, ln, em)

      puts '2. log in user'
      user.succeed_login_as(em, pw)

      puts '3. log out user'
      @connections.close('user')

      puts '4. admin change user email'
      fn2, ln2, em2 = gen_random_id
      puts "new email: #{em2}"
      admin.change_user_email(fn, ln, em, em2)
      sleep 0.5
      # XXX how to tell if a new verification email was sent?

      puts '5. log in using new email and fail'
      user2 = @connections.for('user2')
      user2.nav_to_home
      user2.login_as(em2, pw)
      sleep 0.5
      f = user2.match_source('You must verify your email before logging in!')
      refute_nil f

      puts '6. verify new email'
      admin.mark_user_as_verified(fn, ln, em2)

      puts '7. succeed logging in with new email'
      user2.nav_to_home
      user2.succeed_login_as(em2, pw)
      user2.nav_to_profile
      sleep 0.5
      f = user2.match_source("#{upcase_first_letter(fn)} #{upcase_first_letter(ln)}")
      puts "player name: #{f}"
      refute_nil f
    end

  end
end

each_browser x
