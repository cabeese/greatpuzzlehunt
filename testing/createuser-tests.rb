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
      admin.delete_test_users(CITY_MARKER)
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
      puts "team name: #{teamname}"
      puts "team pw: #{teampw}"
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
      sleep 1

      # second user no longer sees team looking for players
      puts '5. second player cannot see team looking'
      cxn1.nav_to_teams_looking_for_players
      teams = cxn1.team_card_names
      puts "got teams: #{teams}"
      refute teams.include?(teamname)
      sleep 0.5

      # admin cannot see team looking for players
      puts '6. admin cannot see team looking'
      admin.check_looking_for_players(teamname, false)
      sleep 0.5
      
      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end

    it 'creates players looking for team' do
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin
      admin.turn_on_registration
      
      # register users
      NUM = 3
      users = []
      (1..NUM).each do |i|
        users << create_user(:student, :inperson, "#{i - 1}")
      end
      
      # verify user emails and log in
      users.each do |fn, ln, em, pw, cxn|
        puts "user: fn #{fn} ln #{ln} em #{em} pw #{pw}"
        admin.verify_user_email(em)
        sleep 0.5
        cxn.succeed_login_as(em, pw)
      end

      fn0, ln0, em0, pw0, cxn0 = users[0]
      ucfn0 = upcase_first_letter(fn0)
      ucln0 = upcase_first_letter(ln0)
      fn1, ln1, em1, pw1, cxn1 = users[1]
      ucfn1 = upcase_first_letter(fn1)
      ucln1 = upcase_first_letter(ln1)
      fn2, ln2, em2, pw2, cxn2 = users[2]
      ucfn2 = upcase_first_letter(fn2)
      ucln2 = upcase_first_letter(ln2)

      # first player looking for team
      # P0: logged in  P1: logged in  P2: logged in
      # no team
      puts "1. first player looking for team"
      cxn0.nav_to_profile
      cxn0.player_set_looking_for_team(true, 'abcdefghijklmnopqrstuvwxyz')

      # admin can see first player looking
      # P0: looking  P1: logged in  P2: logged in
      # no team
      puts '2. admin can see first player looking'
      admin.admin_nav_to_player_detail(em0)
      puts 'looking for looking message'
      f = admin.get_ext_element(:xpath, '//span[text()="looking"]')
      puts "f: #{f}"
      refute_nil f

      # third player can see first player looking
      # P0: looking  P1: logged in  P2: logged in
      # no team
      puts '3. third player can see first player looking'
      cxn2.nav_to_players_looking_for_team
      card = cxn2.find_player_card(fn0, ln0)
      refute_nil card

      puts '3a. third player sees message button for first player'
      # P0: looking  P1: logged in  P2: logged in
      # no team
      msgb = cxn2.get_ext_element(:xpath, "//div[normalize-space()='#{fn0} #{ln0}']/../..//button[text()='Message player']")
      puts "msgb: #{msgb}"
      refute_nil msgb

      puts '3b. third player can send message to first player'
      # P0: looking  P1: logged in  P2: logged in
      # no team
      msgb.click
      sleep 1

      h = cxn2.get_ext_element(:xpath, "//div[normalize-space()='Message #{upcase_first_letter(fn0)} #{upcase_first_letter(ln0)}']")
      refute_nil h
      puts "header: #{h}"
      cancel = cxn2.get_ext_element(:xpath, '//button[text()="Cancel"]')
      puts "cancel: #{cancel}"
      refute_nil cancel
      cancel.click
      sleep 1

      # second player looking for team
      # P0: looking  P1: logged in  P2: logged in
      # no team
      puts '4. second player looking for team'
      cxn1.nav_to_profile
      cxn1.player_set_looking_for_team(true, 'abcdefghijklmnopqrstuvwxyz')

      # first player can see second looking
      # P0: looking  P1: looking  P2: logged in
      # no team
      puts '5. first player can see second looking'
      cxn0.nav_to_players_looking_for_team
      f = cxn0.find_player_card(fn1, ln1)
      refute_nil f

      # third player creates team
      # P0: looking  P1: looking  P2: logged in
      # no team
      puts '6. third player creates team'
      teamname, _unused, teampw = gen_random_id
      puts "team name: #{teamname}"
      puts "team pw: #{teampw}"
      cxn2.nav_to_profile
      cxn2.create_team_from_profile(teamname, teampw, :alumni, :inperson, true)

      # third player sees other two players looking
      # P0: looking  P1: looking  P2: has team
      # Team created with P2
      puts '7. third player sees other two players looking'
      browse = cxn2.get_ext_element(:xpath, '//a[@href="/looking-for-team"]')
      refute_nil browse
      browse.click
      sleep 0.5
      f0 = cxn2.find_player_card(fn0, ln0)
      refute_nil f0
      f1 = cxn2.find_player_card(fn1, ln1)
      refute_nil f1

      # third player invites first player with empty message
      # P0: looking  P1: looking  P2: has team
      # Team created with P2
      puts '8. third player invites first player with empty message'
      msgb = cxn2.get_ext_element(:xpath, "//div[normalize-space()='#{fn0} #{ln0}']/../..//button[text()='Message player']")
      puts "msgb: #{msgb}"
      refute_nil msgb
      msgb.click
      sleep 1

      h = cxn2.get_ext_element(:xpath, "//div[normalize-space()='Message #{upcase_first_letter(fn0)} #{upcase_first_letter(ln0)}']")
      refute_nil h
      puts "header: #{h}"
      send = cxn2.get_ext_element(:xpath, '//button[text()="Send"]')
      puts "send: #{send}"
      refute_nil send
      send.click
      sleep 1

      # third player gets error message about empty text
      puts '9. third player gets error message about empty text'
      # XXX this isn't checked 

      # third player invites first player with a valid message
      puts '10. third player invites first player with valid message'
      # P0: looking  P1: looking  P2: has team, message dialog
      # Team created with P2
      # XXX skip this because blank message not checked
      close = cxn2.get_ext_element(:xpath, '//button[text()="Close"]')
      puts "close: #{close}"
      refute_nil close
      close.click
      sleep 1

      # second player joins
      # P0: looking  P1: looking  P2: has team
      # Team created with P2
      puts '11. first player joins'
      cxn1.join_team(teamname, teampw)

      # first player joins
      puts '12. second player joins'
      # P0: looking  P1: has team  P2: has team
      # Team created with P2, P1
      cxn0.join_team(teamname, teampw)

      # player 3 sees all three team members
      # P0: has team  P1: has team: has team
      # Team created with P2, P0, P1
      puts '13. third player sees team membership'
      cxn2.nav_to('team')
      sleep 1
      puts 'looking for player 0 name'
      x = "//div[normalize-space()='#{ucfn0} #{ucln0}']"
      puts "xpath: #{x}"
      c = cxn2.get_ext_element(:xpath, x)
      refute_nil c
      puts 'looking for player 0 card'
      c0 = cxn2.find_player_card(ucfn0, ucln0) 
      refute_nil c0
      puts 'looking for player 1 name'
      x = "//div[normalize-space()='#{ucfn1} #{ucln1}']"
      puts "xpath: #{x}"
      c = cxn2.get_ext_element(:xpath, x)
      refute_nil c
      puts 'looking for player 1'
      c1 = cxn2.find_player_card(ucfn1, ucln1)
      refute_nil c1
      puts 'looking for player 2 name'
      x = "//div[normalize-space()='#{ucfn2} #{ucln2}']"
      puts "xpath: #{x}"
      c = cxn2.get_ext_element(:xpath, x)
      refute_nil c
      puts 'looking for player 2'
      c2 = cxn2.find_player_card(ucfn2, ucln2)
      refute_nil c2

      # admin sees all three team members
      # P0: has team  P1: has team: has team
      # Team created with P2, P0, P1
      puts '14. admin sees all three team members'
      admin.check_team_membership(teamname, users)

      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end

    it 'create team and remove players' do
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin
      admin.turn_on_registration
      
      # register users
      NUM = 3
      users = []
      (1..NUM).each do |i|
        users << create_user(:student, :inperson, "#{i - 1}")
      end
      
      # verify user emails and log in
      users.each do |fn, ln, em, pw, cxn|
        puts "user: fn #{fn} ln #{ln} em #{em} pw #{pw}"
        admin.verify_user_email(em)
        sleep 0.5
        cxn.succeed_login_as(em, pw)
      end

      fn0, ln0, em0, pw0, cxn0 = users[0]
      ucfn0 = upcase_first_letter(fn0)
      ucln0 = upcase_first_letter(ln0)
      fn1, ln1, em1, pw1, cxn1 = users[1]
      ucfn1 = upcase_first_letter(fn1)
      ucln1 = upcase_first_letter(ln1)
      fn2, ln2, em2, pw2, cxn2 = users[2]
      ucfn2 = upcase_first_letter(fn2)
      ucln2 = upcase_first_letter(ln2)

      puts '1. P0 creates team'
      teamname, teampw, _unused = gen_random_id
      puts "team name: #{teamname}"
      puts "team pw: #{teampw}"
      cxn0.create_team_from_profile(teamname, teampw, :alumni, :inperson, true)

      puts '2. P1 joins team'
      cxn1.join_team(teamname, teampw)

      puts '3. P2 joins team'
      cxn2.join_team(teamname, teampw)
      admin.check_team_membership(teamname, users)

      puts '4. P0 removes P2'
      cxn0.player_remove_team_member(teamname, fn2, ln2, em2, true)

      puts '5. P0 removes P0 and gets error'
      cxn0.player_remove_team_member(teamname, fn0, ln0, em0, true)

      puts '6. P0 deletes team'
      del = cxn0.get_ext_element(:xpath, '//button[text()="Delete Team"]')
      del.click
      sleep 0.5
      cxn0.accept_alert

      puts '7. P1 has no team'
      cxn1.nav_to('team')
      f = cxn1.match_source('I know who I\'ll be playing with')
      assert f

      puts '8. P0 has no team'
      cxn0.nav_to('team')
      f = cxn0.match_source('I know who I\'ll be playing with')
      assert f

      # clean up
      admin.delete_test_users(CITY_MARKER)
      admin.turn_off_registration
    end
  end
end

# Safari does not support opening two parallel sessions to 
each_browser x
