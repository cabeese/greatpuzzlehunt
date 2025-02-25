# frozen_string_literal: true

require 'minitest/spec'
require 'securerandom'
require 'selenium-webdriver'

require_relative 'adminutils'
require_relative 'config'
require_relative 'webutils'

Minitest.seed = 1234

x = proc do |browser|
  describe "Team checkin tests #{browser}" do
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
      teamid = leader.start_check_in_inperson_team

      # volunteer (admin) confirms checkin
      admin.confirm_check_in(teamid)

      # admin confirm team checked in
      admin.check_team_membership(teamname, users)
      admin.check_team_checked_in(teamname)

      # clean up
      admin.turn_off_checkin
      admin.delete_test_users(CITY_MARKER)
    end

    it 'checks in a team without all players present' do
      admin = @connections.for('admin')
      admin.nav_to_home
      admin.succeed_login_as_admin

      # create a virtual team of N virtual players
      admin.turn_on_registration
      teamname, teampw, users = create_team(@connections, admin, 4, :inperson, :inperson)
      admin.turn_off_registration

      leader = users[0][4]

      admin.turn_on_checkin

      # leader starts checkin, but only partial
      teamid = leader.fail_check_in_partial_team

      # check in, but there will be some people not here
      admin.confirm_check_in(teamid, false)

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

      # check in not allowed
      admin.turn_off_registration
      admin.turn_off_checkin

      leader = users[0][4]

      leader.fail_start_check_in

      # clean up
      admin.delete_test_users(CITY_MARKER)
    end

    it 'decodes QR code' do
      admin = @connections.for('admin')
      admin.nav_to('qrcode')

      qr = admin.get_ext_element(:xpath, '//canvas')
      puts "got qr: #{qr}"
      refute_nil qr
      
      qrss = qr.screenshot_as(:base64).unpack1('m')
      puts "qrss is: #{qrss}"
      IO.write('qrcode.png', qrss)

      txt = WebTestUtils.decode_qr(@connections, 'qrcode.png')
      puts "got text: #{txt}"
      assert_equal 'Hello QR Codes!', txt
    end
  end

end

each_browser x
