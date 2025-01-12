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
      start_server(@reqbrowser, false, false, false)
    end

    after do
      shutdown_server
    end

    it 'creates and activates new user account' do
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

      # check that the user was created
      admin.nav_to('admin/users')

      # make sure the new user is listed on the users list page
      f = admin.match_source("#{fn} #{ln}")
      refute_nil f
      f = admin.match_source(em)
      refute_nil f

      # make sure the user shows email is not verified
      emailtd  = admin.get_ext_element(:xpath, "//td/span[text()='#{em}']")
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
      morebutton = admin.get_ext_element(:xpath, "//td/span[text()='#{em}']/../../td/button[text()='More']")
      puts "morebutton: #{morebutton} text: #{morebutton.text}"
      refute_nil morebutton

      # bring up the user details
      morebutton.click
      sleep 0.5

      # make sure that we have the details modal up
      f = admin.match_source('Player Details')
      puts "player details: #{f}"
      refute_nil f
      sleep 0.5

      # verify the email address
      verifybutton = admin.get_ext_element(:xpath, '//button[text()="Verify Email"]')
      puts "verify button: #{verifybutton} text: #{verifybutton.text}"
      verifybutton.click

      # close the modal
      closeicon = admin.get_ext_element(:xpath, '//div/i[contains(@class, "close")]')
      puts "modal close: #{closeicon} text: #{closeicon.text}"
      closeicon.click
      sleep 0.5

      # make sure the email icon only is showing (no dont icon)
      emailtd  = admin.get_ext_element(:xpath, "//td/span[text()='#{em}']")
      puts "emailtd: #{emailtd} text: #{emailtd.text}"
      refute_nil emailtd
      emailicon = get_sub_element(emailtd, :class, 'mail')
      puts "emailicon: #{emailicon}"
      refute_nil emailicon
      green = get_sub_element(emailtd, :class, 'green')
      puts "green: #{green}"
      refute_nil green

      # clean up
      # admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end

    it 'creates a team of three' do
      # ensure registration is turned on
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin
      admin.turn_on_registration

      NUM = 3
      users = []
      cxns = []
      (1..NUM).each do |i|
        fn, ln, em = gen_random_id
        cxn = @connections.for(em)
        users << [fn, ln, em, cxn]
      end

      # register the users
      users.each do |fn, ln, em, cxn|
        cxn.nav_to_register
        cxn.fill_registration_form(fn, ln, em,
                               :student, 'abcdefghijk', 'abcdefghijk', :virtual,
                               '555-555-5555', '37', '10 Maple', CITY_MARKER,
                               '01234', 'NE', 'USA', 'Abc Defgh', 'def',
                               '123-456-7890', 'abc@def.ghi', true, true)
        cxn.submit_registration_form
        f = cxn.match_source('Thank you for creating an account')
        refute_nil f
        f = cxn.match_source(em)
        refute_nil f
      end

      # verify user emails
      users.each do |fn, ln, em, cxn|
        admin.verify_user_email(em)
      end

      # log in as leader (zeroth id) and form team
      fn, ln, em, cxn = users[0]
      cxn.succeed_login_as(em, 'abcdefghijk')
      teamname, _unused, teampw = gen_random_id
      cxn.create_team_from_profile(teamname, teampw, :postsec, :inperson, false)

      # check that team exists
      admin.nav_to('admin/teams')
      f = admin.match_source(teamname)
      refute_nil f

      # join player 2
      fn, ln, em, cxn = users[1]
      cxn.succeed_login_as(em, 'abcdefghijk')
      cxn.join_team(teamname, teampw)
      
      # join player 3
      fn, ln, em, cxn = users[2]
      cxn.succeed_login_as(em, 'abcdefghijk')
      cxn.join_team(teamname, teampw)

      # check team membership from admin
      admin.nav_to('admin/teams')
      tn = admin.get_ext_element(:xpath, "//td[text()='#{teamname}']")
      refute_nil tn
      tb = admin.get_sub_element(tn, :xpath, "../td/button[text()='More']")
      tb.click
      sleep 0.5
      f = admin.match_source('Team _id:')
      refute_nil f
      i = 0
      users.each do |fn, ln, em, _cxn|
        puts "looking to match  #{i}: #{fn} #{ln}"
        f = admin.get_ext_element(:xpath, "//td[text()='#{upcase_first_letter(fn)} #{upcase_first_letter(ln)}']")
        refute_nil f
        i += 1
      end
      cb = admin.get_ext_element(:xpath, '//button[text()="Close"]')
      cb.click
      sleep 0.5

      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end

    it 'creates a team of three, virtual' do
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin
      admin.turn_on_registration

      # register users
      NUM = 3
      users = []
      (1..NUM).each do |i|
        users << create_user(:student, :virtual)
      end

      # verify user emails and log in
      users.each do |fn, ln, em, pw, cxn|
        admin.verify_user_email(em)
        sleep 0.5
        cxn.succeed_login_as(em, pw)
      end

      # first user creates team
      fn, ln, em, pw, cxn = users[0]
      teamname, _unused, teampw = gen_random_id
      cxn.create_team_from_profile(teamname, teampw, :postsec, :virtual, false)

      # player 2 joins
      fn, ln, em, pw, cxn = users[1]
      cxn.join_team(teamname, teampw)

      # player 3 joins
      fn, ln, em, pw, cxn = users[2]
      cxn.join_team(teamname, teampw)

      admin.check_team_membership(teamname, users)

      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end
    
    it 'creates a team looking for players' do
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin
      admin.turn_on_registration
      
      # register users
      NUM = 3
      users = []
      (1..NUM).each do |i|
        users << create_user(:student, :virtual)
      end
      
      # verify user emails and log in
      users.each do |fn, ln, em, pw, cxn|
        puts "user: fn #{fn} ln #{ln} em #{em} pw #{pw}"
        admin.verify_user_email(em)
        sleep 0.5
        cxn.succeed_login_as(em, pw)
      end
      
      # first user creates team, sets as looking for players
      puts '1. create team'
      fn, ln, em, pw, cxn0 = users[0]
      teamname, _unused, teampw = gen_random_id
      cxn0.create_team_from_profile(teamname, teampw, :alumni, :inperson, true)

      # second user can see team as looking for players
      puts '2. second player can see team looking'
      fn, ln, em, pw, cxn1 = users[1]
      cxn1.nav_to_teams_looking_for_players
      f = cxn1.find_team_card(teamname)
      puts "found team card: #{f}"
      puts "    text: #{f.text}"
      refute_nil f
      sleep 0.5

      # admin can see looking for players
      puts '3. admin can see team looking'
      admin.check_looking_for_players(teamname, true)
      sleep 0.5

      # first user turns off looking for players
      puts '4. turn off looking'
      cxn0.player_nav_to_team(teamname)
      cxn0.player_set_team_looking(false)
      sleep 0.5

      # second user no longer sees team looking for players
      puts '5. second player cannot see team looking'
      cxn1.nav_to_profile
      cxn1.nav_to_teams_looking_for_players
      assert cxn1.no_match_source(teamname)
      sleep 0.5

      # admin cannot see team looking for players
      puts '6. admin cannot see team looking'
      admin.check_looking_for_players(teamname, false)
      sleep 0.5
      
      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end
  end
end

# Safari does not support opening two parallel sessions to 
each_browser x
