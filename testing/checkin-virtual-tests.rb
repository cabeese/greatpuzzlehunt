# frozen_string_literal: true

require 'minitest/spec'
require 'securerandom'
require 'selenium-webdriver'

require_relative 'adminutils'
require_relative 'config'
require_relative 'webutils'

Minitest.seed = 1234

x = proc do |browser|
  describe "Virtual team checkin tests #{browser}" do
    include WebTestUtils
    
    before do
      @reqbrowser = browser
      set_base_url TESTCONFIG[:site]
      start_server(@reqbrowser)
      # turn_on_registration(@adminbrowser)
    end

    after do
      # turn_off_registration(@adminbrowser)
      shutdown_server
    end

    it 'can turn checkin on and off' do
      puts '1. starting'
      admin = @connections.for('admin')
      puts '2. nav to home'
      admin.nav_to_home
      puts '3. login'
      admin.succeed_login_as_admin

      puts '4. turn on'
      admin.turn_on_checkin

      puts '5. turn off'
      admin.turn_off_checkin
    end

    it 'creates and checks in a virtual team' do
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin

      # create a virtual team of N virtual players
      admin.turn_on_registration
      teamname, teampw, users = create_team(@connections, admin, 4, :virtual, :virtual)
      admin.turn_off_registration

      leader = users[0][4]

      admin.turn_on_checkin

      # leader marks players as here
      leader.check_in_virtual_team

      # admin confirm team checked in
      admin.check_team_membership(teamname, users)
      admin.check_team_checked_in(teamname)

      # clean up
      admin.turn_off_checkin
      admin.delete_test_users(CITY_MARKER)
    end

    it 'creates and checks in an in-person team' do
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin

      # create an inperson team of N virtual players
      admin.turn_on_registration
      teamname, teampw, users = create_team(@connections, admin, 4, :inperson, :inperson)
      admin.turn_off_registration

      leader = users[0][4]

      admin.turn_on_checkin

      # leader starts checkin
      leader.start_check_in_inperson_team
      # XXX continue checkin

      # admin confirm team checked in
      admin.check_team_membership(teamname, users)
      admin.check_team_checked_in(teamname)

      # clean up
      admin.turn_off_checkin
      admin.delete_test_users(CITY_MARKER)
    end

    it 'creates and checks in a team mixed virtual and in person'

    it 'does not check in a team without all players present' do
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin

      # create a virtual team of N virtual players
      admin.turn_on_registration
      teamname, teampw, users = create_team(@connections, admin, 4, :virtual, :virtual)
      admin.turn_off_registration

      leader = users[0][4]

      admin.turn_on_checkin

      # admin confirm team checked in
      admin.check_team_membership(teamname, users)

      # leader marks players as here
      leader.fail_check_in_partial_team

      # clean up
      admin.turn_off_checkin
      admin.delete_test_users(CITY_MARKER)
    end

    it 'does not check in a team that is too small' do
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin

      # create a virtual team of N virtual players
      admin.turn_on_registration
      teamname, teampw, users = create_team(@connections, admin, 2, :virtual, :virtual)
      admin.turn_off_registration

      leader = users[0][4]

      admin.turn_on_checkin

      # admin confirm team checked in
      admin.check_team_membership(teamname, users)

      # leader marks players as here
      # XXX fail at checkin 
      leader.check_in_virtual_team

      # clean up
      admin.turn_off_checkin
      admin.delete_test_users(CITY_MARKER)
    end

    it 'disallows checkin when checkin off' do
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin

      # create a virtual team of N virtual players
      admin.turn_on_registration
      teamname, teampw, users = create_team(@connections, admin, 2, :virtual, :virtual)
      admin.turn_off_registration

      leader = users[0][4]

      # XXX try checkin and get failure message

      # clean up
      admin.delete_test_users(CITY_MARKER)
    end
  end

end

each_browser x
