# frozen_string_literal: true

require_relative 'webutils'

module WebTestUtils

  class Connection

    include Minitest::Assertions

    attr_accessor :assertions
    
    def initialize(browser, headless, baseurl)
      @cxn = nil
      @browser = browser
      @headless = headless
      @baseurl = baseurl
      @assertions = 0
      if (browser == :firefox) && headless
        options = Selenium::WebDriver::Firefox::Options.new(args: ['-headless'])
        @cxn = Selenium::WebDriver.for browser, options: options
      elsif (browser == :chrome) && headless
        options = Selenium::WebDriver::Chrome::Options.new(args: ['headless'])
        @cxn = Selenium::WebDriver.for browser, options: options
      else
        @cxn = Selenium::WebDriver.for browser
      end
      
      @wait = Selenium::WebDriver::Wait.new(:timeout => 10)
      @longwait = Selenium::WebDriver::Wait.new(:timeout => 30)
    end

    attr_reader :cxn

    def close
      @cxn.quit
      @cxn = nil
    end

    def get_element(x)
      @wait.until do
        e = @cxn.find_element(x)
        e
      end
    end

    def get_ext_element(m, x)
      @wait.until do
        e = @cxn.find_element(m, x)
        e
      end
    end

    def get_ext_elements(m, x)
      @wait.until do
        e = @cxn.find_elements(m, x)
        e
      end
    end

    def get_sub_element(fromelement, m, x)
      @wait.until do
        e = fromelement.find_element(m, x)
        e
      end
    end
    
    def get_sub_elements(fromelement, m, x)
      @wait.until do
        e = fromelement.find_elements(m, x)
        e
      end
    end
    
    def match_source(str)
      @wait.until do
        @cxn.page_source.include?(str)
      end
    end

    def no_match_source(str)
      puts "no match source: #{str}"
      s = @cxn.page_source
      puts "source: #{s}"
      !s.include?(str)
    end

    def accept_alert
      alert = @cxn.switch_to.alert
      alert.accept
    end

    def nav_to(path)
      puts "in nav_to: #{path}"
      x = @cxn.find_element(:tag_name, 'html')
      puts "got old page element: #{x}"
      @cxn.get "#{@baseurl}/#{path}"
      puts 'waiting on page load'
      @wait.until do
        puts '...polling'
        y = @cxn.find_element(:tag_name, 'html')
        puts "...got element #{y}"
        x != y
      end
      puts 'done with page load'
    end

    def nav_to_home
      puts 'in nav_to_home'
      x = @cxn.find_element(:tag_name, 'html')
      puts "got old page element: #{x}"
      @cxn.get "#{@baseurl}/"
      puts 'waiting on home page load'
      @wait.until do
        puts '...polling'
        y = @cxn.find_element(:tag_name, 'html')
        puts "...got element #{y}"
        x != y
      end
      puts 'done with home page load'
    end

    def nav_to_register
      nav_to_home
      b = get_ext_element(:xpath, '//a[@href="/register"]')
      puts "found register link: #{b}"
      refute_nil b
      b.click
      b = match_source('Create account for the')
      puts "found create account message: #{b}"
      refute_nil b
    end

    def nav_to_profile
      nav_to('profile')
    end

    def login_as(userarg, pwarg)
      puts "login as #{userarg}, pw #{pwarg}"
      b = @wait.until do
        e = @cxn.find_element(:xpath, '//div/a[@href="/login"]')
        e
      end
      b.click
      un = get_ext_element(:xpath, '//input[@name="email"]')
      pw = get_ext_element(:xpath, '//input[@name="password"]')
      sub = get_ext_element(:xpath, '//button[@type="submit"]')
      refute_nil un
      refute_nil pw
      refute_nil sub
      # puts "found user name: text #{un.text}"
      # puts "found password: text #{pw.text}"
      # puts "found submission: text #{sub.text}"
      un.send_keys(userarg)
      pw.send_keys(pwarg)
      sub.click
    end

    def succeed_login_as(user, pw)
      login_as(user, pw)
      
      # check that now on the user page
      match_source('Last Updated')
    end

    def login_as_admin
      puts 'login as admin'
      login_as(TESTCONFIG[:adminuser], TESTCONFIG[:adminpw])
    end

    def succeed_login_as_admin
      login_as_admin
      match_source('Last Updated')
      match_source(TESTCONFIG[:adminfullname])
      match_source('Admin')
    end

    def turn_on_registration
      puts 'admin: turn on registration'
      
      # go to the game control page
      nav_to('admin/gamestate')
      
      # find in-person registration toggle
      toggle = get_ext_element(:xpath, '//div/label[text()="In-Person Registration"]/..')
      puts "got toggle div: #{toggle}"
    
      # if not checked, click it and then confirm the popup alert
      toggle_class = toggle.attribute('class')
      unless toggle_class.include?('checked')
        puts('toggling registration')
        toggle.click
        sleep 1
        accept_alert
      end
      
      # confirm in person toggle is checked
      toggle_class_2 = toggle.attribute('class')
      ret = toggle_class_2.include?('checked')
      puts "registration toggled on: #{ret}"
      
      # find virtual registration toggle
      toggle = get_ext_element(:xpath, '//div/label[text()="Virtual Registration"]/..')
      puts "got toggle div: #{toggle}"
    
      # if not checked, click it and then confirm the popup alert
      toggle_class = toggle.attribute('class')
      unless toggle_class.include?('checked')
        puts('toggling registration')
        toggle.click
        sleep 1
        accept_alert
      end
      
      # confirm virtual toggle is checked
      toggle_class_2 = toggle.attribute('class')
      ret = toggle_class_2.include?('checked')
      puts "registration toggled on: #{ret}"
      
      ret
    end
  
    def turn_off_registration
      puts 'admin: turn off registration'
      
      # go to the game control page
      nav_to('admin/gamestate')
      
      # find in-person registration toggle
      toggle = get_ext_element(:xpath, '//div/label[text()="In-Person Registration"]/..')
      puts "got toggle div: #{toggle}"
    
      # if checked, click it and then confirm the popup alert
      toggle_class = toggle.attribute('class')
      if toggle_class.include?('checked')
        puts('toggling registration')
        toggle.click
        sleep 1
        accept_alert
      end
    
      # confirm in-person toggle state
      toggle_class_2 = toggle.attribute('class')
      ret = !toggle_class_2.include?('checked')
      puts "registration toggled off: #{ret}"
      
      # find virtual registration toggle
      toggle = get_ext_element(:xpath, '//div/label[text()="Virtual Registration"]/..')
      puts "got toggle div: #{toggle}"
      
      # if checked, click it and then confirm the popup alert
      toggle_class = toggle.attribute('class')
      if toggle_class.include?('checked')
        puts('toggling registration')
        toggle.click
        sleep 1
        accept_alert
      end
      
      # confirm virtual toggle state
      toggle_class_2 = toggle.attribute('class')
      ret = !toggle_class_2.include?('checked')
      puts "registration toggled off: #{ret}"
      
      ret
    end
    
    # @param [Symbol, nil] accttypearg one of :student, :nonstudent, :volunteer
    # @param [Symbol] gamemode one of :virtual, :inperson
    def fill_registration_form(fnarg, lnarg, emailarg, accttypearg, pw1arg, pw2arg, gamemode, phonearg, agearg, streetarg, cityarg, ziparg, statearg, countryarg, ecnamearg, ecrelarg, ecphonearg, ecemailarg, photoarg, hharg)
      fn = get_ext_element(:xpath, '//input[@name="firstname"]')
      ln = get_ext_element(:xpath, '//input[@name="lastname"]')
      m = get_ext_element(:xpath, '//input[@name="email"]')
      pw = get_ext_element(:xpath, '//input[@name="password"]')
      pw2 = get_ext_element(:xpath, '//input[@name="confirmPassword"]')
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
      photo = get_ext_element(:xpath, '//input[@name="photoPermission"]')
      hh = get_ext_element(:xpath, '//input[@name="holdHarmless"]')
      refute_nil fn
      refute_nil ln
      refute_nil m
      refute_nil pw
      refute_nil pw2
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
      
      unless fnarg.nil?
        fn.send_keys(fnarg)
      end
      unless lnarg.nil?
        ln.send_keys(lnarg)
      end
      unless emailarg.nil?
        m.send_keys(emailarg)
      end
      
      unless accttypearg.nil?
        @cxn.action.send_keys(:tab).perform
        if accttypearg == :nonstudent
          @cxn.action.send_keys(:down).perform
        elsif accttypearg == :volunteer
          @cxn.action.send_keys(:down).perform
          @cxn.action.send_keys(:down).perform
        end
        @cxn.action.send_keys(:space).perform
      end

      unless pw1arg.nil?
        pw.send_keys(pw1arg)
      end
      unless pw2arg.nil?
        pw2.send_keys(pw2arg)
      end
      
      unless gamemode.nil?
        @cxn.action.send_keys(:tab).perform
        if gamemode == :inperson
          @cxn.action.send_keys(:down).perform
        elsif gamemode == :virtual
          @cxn.action.send_keys(:down).perform
          @cxn.action.send_keys(:down).perform
        end
        @cxn.action.send_keys(:space).perform
      end
      
      unless phonearg.nil?
        phone.send_keys(phonearg)
      end
      unless agearg.nil?
        age.send_keys(agearg)
      end
      unless streetarg.nil?
        addr.send_keys(streetarg)
      end
      unless cityarg.nil?
        city.send_keys(cityarg)
      end
      unless ziparg.nil?
        zip.send_keys(ziparg)
      end
      unless statearg.nil?
        state.send_keys(statearg)
      end
      unless countryarg.nil?
        country.send_keys(countryarg)
      end
      unless ecnamearg.nil?
        ecname.send_keys(ecnamearg)
      end
      unless ecrelarg.nil?
        ecrelationship.send_keys(ecrelarg)
      end
      unless ecphonearg.nil?
        ecphone.send_keys(ecphonearg)
      end
      unless ecemailarg.nil?
        ecemail.send_keys(ecemailarg)
      end
      
      unless photoarg
        photo.send_keys(:space)
      end
      
      if hharg
        hh.send_keys(:space)
      end
    end
    
    def submit_registration_form
      sub = get_ext_element(:xpath, '//button[@type="submit"]')
      refute_nil sub
      sub.click
    end

    def verify_user_email(email)
      nav_to('admin/users')
      sleep 0.5
      
      morebutton = get_ext_element(:xpath, "//td/span[text()='#{email}']/../../td/button[text()='More']")
      morebutton.click
      sleep 0.5
      
      # make sure that we have the details modal up
      f = match_source('Player Details')
      puts "player details: #{f}"
      refute_nil f
      
      # verify the email address
      verifybutton = get_ext_element(:xpath, '//button[text()="Verify Email"]')
      puts "verify button: #{verifybutton} text: #{verifybutton.text}"
      verifybutton.click
      sleep 0.5
      
      # close the modal
      closeicon = get_ext_element(:xpath, '//div/i[contains(@class, "close")]')
      puts "modal close: #{closeicon} text: #{closeicon.text}"
      closeicon.click
      sleep 0.5
    end

    def change_user_email(fn, ln, oldemail, newemail)
      nav_to('admin/users')
      sleep 0.5
      
      morebutton = get_ext_element(:xpath, "//td/span[text()='#{oldemail}']/../../td/button[text()='More']")
      morebutton.click
      sleep 0.5
      
      # make sure that we have the details modal up
      f = match_source('Player Details')
      puts "player details: #{f}"
      refute_nil f
      f = match_source("#{upcase_first_letter(fn)} #{upcase_first_letter(ln)}")
      puts "player name: #{f}"
      refute_nil f

      # update email field
      ef = get_ext_element(:xpath, '//input[@name="email"]')
      refute_nil ef
      ef.clear
      ef.send_keys(newemail)

      # save changes
      update = get_ext_element(:xpath, '//button[text()="Update"]')
      refute_nil update
      update.click
      sleep 0.5
      accept_alert
      sleep 1
      accept_alert
    end

    def delete_test_users(marker)
      nav_to('admin/users')
      sleep 0.5
    
      buttons = @cxn.find_elements(:xpath, '//button[text()="More"]')
      puts "found #{buttons.length} more buttons on users admin page"
      if buttons.length == 0
        puts 'found no more buttons'
        @cxn.save_screenshot('./cleanup-no-more-buttons.png')
      end
      buttons.each do |button|
        puts "...clicking on #{button}"
        begin
          @cxn.save_screenshot('./preclickmore.png')
          button.click
          sleep 0.5
          if @cxn.page_source.include?(marker)
            puts 'user has city marker, deleting'
            delete_button = @cxn.find_element(:xpath, '//div[@class="actions"]/div/button[last()]')
            begin
              delete_button.click
              sleep 0.5
            rescue Selenium::WebDriver::Error::ElementClickInterceptedError => e
              puts 'unable to delete; click intercepted error'
              puts "exception: #{e}"
              puts "backtrace: #{e.backtrace}"
              @cxn.save_screenshot('./clickintercept.png')
            end
            alert = @cxn.switch_to.alert
            unless alert.text.downcase.include? 'confirm delete '
              @cxn.save_screenshot('./unknownalert.png')
              raise 'unknown alert while deleting users'
            end
            alert.accept
          else
            # just close the modal
            puts 'user does not have city marker, not deleting'
            closebutton = get_ext_element(:xpath, '//div/div/i[@class="close icon"]')
            closebutton.click
          end
          
          found = true
          t = Time.now
          while found
            if Time.now > (t + 30.0)
              @cxn.save_screenshot('./player-dialog-not-gone.png')
              raise 'Player dialog is not going away'
            end
            puts 'polling until player details dialog goes away'
            found = @cxn.page_source.include?('Player Details')
            sleep 0.1
          end
        rescue Selenium::WebDriver::Error::ElementClickInterceptedError => e
          puts "got click intercepted in cleanup: #{e}"
          puts "backtrace: #{e.backtrace}"
          @cxn.save_screenshot('./clickintercept2.png')
          raise
        rescue => e
          puts "got exception in cleanup: #{e}"
          puts "class #{e.class}"
          puts "backtrace: #{e.backtrace}"
        end
        sleep 1
      end
      puts 'done deleting test users'
    end

    def mark_user_as_verified(fn, ln, em)
      # check that the user was created
      nav_to('admin/users')

      # make sure the new user is listed on the users list page
      f = match_source("#{fn} #{ln}")
      refute_nil f
      f = match_source(em)
      refute_nil f

      # make sure the user shows email is not verified
      emailtd  = get_ext_element(:xpath, "//td/span[text()='#{em}']")
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
      morebutton = get_ext_element(:xpath, "//td/span[text()='#{em}']/../../td/button[text()='More']")
      puts "morebutton: #{morebutton} text: #{morebutton.text}"
      refute_nil morebutton

      # bring up the user details
      morebutton.click
      sleep 0.5

      # make sure that we have the details modal up
      f = match_source('Player Details')
      puts "player details: #{f}"
      refute_nil f
      sleep 0.5

      # verify the email address
      verifybutton = get_ext_element(:xpath, '//button[text()="Verify Email"]')
      puts "verify button: #{verifybutton} text: #{verifybutton.text}"
      verifybutton.click

      # close the modal
      closeicon = get_ext_element(:xpath, '//div/i[contains(@class, "close")]')
      puts "modal close: #{closeicon} text: #{closeicon.text}"
      closeicon.click
      sleep 0.5

      # make sure the email icon only is showing (no dont icon)
      emailtd  = get_ext_element(:xpath, "//td/span[text()='#{em}']")
      puts "emailtd: #{emailtd} text: #{emailtd.text}"
      refute_nil emailtd
      emailicon = get_sub_element(emailtd, :class, 'mail')
      puts "emailicon: #{emailicon}"
      refute_nil emailicon
      green = get_sub_element(emailtd, :class, 'green')
      puts "green: #{green}"
      refute_nil green
    end

    # @param [Symbol] division :postsec, :alumni, :sec, or :open
    # @param [Symbol] mode :virtual or :inperson
    # @param [Boolean] looking true -> turn on looking for members
    def create_team_from_profile(teamname, teampw, division, mode, looking)
      # look for create team button and click it
      createbutton = get_ext_element(:xpath, "//button[text()='Create a Team']")
      refute_nil createbutton
      createbutton.click
      sleep 0.5
      f = match_source('We reserve veto rights')
      refute_nil f
      
      # Fill in the team
      # name
      tn = get_ext_element(:xpath, '//input[@name="name"]')
      refute_nil tn
      tn.send_keys(teamname)
      
      # pw
      tpw = get_ext_element(:xpath, '//input[@name="password"]')
      refute_nil tpw
      tpw.send_keys(teampw)

      # division
      tdiv = get_ext_element(:xpath, '//input[@name="division"]/..')
      refute_nil tdiv
      tdiv.click

      # play
      tplay = get_ext_element(:xpath, '//a[text()="Play In-Person"]')
      tplay.click

      # looking
      if looking
        lfm = get_ext_element(:xpath, '//input[@name="lookingForMembers"]/..')
        refute_nil lfm
        lfm.click
      end

      # submit
      sub = get_ext_element(:xpath, '//button[text()="Create Team"]')
      sub.click
      sleep 0.5

      # check that team exists
      f = match_source("Team: #{teamname}")
      refute_nil f
    end

    def find_team_card(teamname)
      puts "find team card: #{teamname}"
      get_ext_element(:xpath, "//div[text()='#{teamname}']/../..")
    end

    def find_player_card(firstname, lastname)
      puts "find player card: #{firstname} #{lastname}"
      @cxn.save_screenshot('./find-player-card.png')
      # XXXM3 m3 test site does not support this yet
      # get_ext_element(:xpath, "//div[normalize-space()='#{firstname} #{lastname}']/../..")
      get_ext_element(:xpath, "//div[text()='#{firstname}']/../..")
    end

    def find_player_card_2(firstname, lastname)
      puts "find player card: #{firstname} #{lastname}"
      @cxn.save_screenshot('./find-player-card.png')
      get_ext_element(:xpath, "//div[normalize-space()='#{firstname} #{lastname}']/../..")
    end
    
    def join_team(teamname, teampw)
      puts "in join team, name: #{teamname} pw: #{teampw}"
      @cxn.save_screenshot('./join-team-start.png')
      nav_to('team/join')
      sleep 0.5
      hdr = get_ext_element(:xpath, "//h1[text()='Join a Team']")
      refute_nil hdr
      puts 'about to look for team card'
      @cxn.save_screenshot('./join-team-find-card.png')
      card = find_team_card(teamname)
      puts "got team card: #{card}"
      puts "text: #{card.text}"
      # joinbutton = get_ext_element(card, :xpath, "//div[text()='#{teamname}'/../..//button[text()='Join Team']")
      joinbutton = get_ext_element(:xpath, "//div[text()='#{teamname}']/../..//button[text()='Join Team']")
      joinbutton.click
      sleep 0.5

      pw = get_sub_element(card, :xpath, '//input[@name="password"]')
      pw.send_keys(teampw)

      sub = get_sub_element(card, :xpath, '//button[text()="Submit"]')
      sub.click
      sleep 0.5

      f = match_source("Team: #{teamname}")
      refute_nil f
    end

    def player_nav_to_team(teamname)
      nav_to('team')
      f = match_source("Team: #{teamname}")
      refute_nil f
    end

    def player_set_team_looking(looking)
      puts "player set team looking: #{looking}"
      lfm = get_ext_element(:xpath, '//input[@name="lookingForMembers"]/..')
      refute_nil lfm

      puts "set team looking to: #{looking}"
      toggle_class = lfm.attribute('class')
      puts "   current class: #{toggle_class}"
      if toggle_class.include?('checked')
        puts 'currently checked'
        if !looking
          puts('toggling registration off')
          lfm.click
        end
      else
        puts 'not currently checked'
        if looking
          puts('toggling registration on')
          lfm.click
        end
      end
      sleep 2

      puts "afterward, toggle class: #{lfm.attribute('class')}"

      save = get_ext_element(:xpath, '//button[text()="Save Team"]')
      refute_nil save
      save.click
      sleep 1
      puts 'done player set team looking'
    end

    def admin_nav_to_player_detail(email)
      nav_to('admin/users')
      sleep 0.5
      morebutton = get_ext_element(:xpath, "//td/span[text()='#{email}']/../../td/button[text()='More']")
      puts "morebutton: #{morebutton} text: #{morebutton.text}"
      refute_nil morebutton
      
      # bring up the user details
      morebutton.click
      sleep 0.5
      
      # make sure that we have the details modal up
      f = match_source('Player Details')
      puts "player details: #{f}"
      refute_nil f
      sleep 0.5
    end

    def admin_nav_to_team_dialog(teamname)
      nav_to('admin/teams')
      tn = get_ext_element(:xpath, "//td[text()='#{teamname}']")
      refute_nil tn
      tb = get_sub_element(tn, :xpath, "../td/button[text()='More']")
      tb.click
      sleep 0.5
      f = match_source('Team _id:')
      refute_nil f
    end

    def close_dialog
      cb = get_ext_element(:xpath, '//button[text()="Close"]')
      cb.click
      sleep 0.5
    end

    def check_team_membership(teamname, users)
      admin_nav_to_team_dialog(teamname)

      i = 0
      users.each do |fn, ln, em, pw, cxn|
        puts "looking to match  #{i}: #{fn} #{ln}"
        f = get_ext_element(:xpath, "//td[text()='#{upcase_first_letter(fn)} #{upcase_first_letter(ln)}']")
        refute_nil f
        i += 1
      end

      close_dialog
    end

    def check_looking_for_players(teamname, looking)
      puts "check looking for players: #{teamname}, #{looking}"
      admin_nav_to_team_dialog(teamname)

      lstr = 'Looking for members? ' + (looking ? 'yes' : 'no')
      puts "lstr: #{lstr}"

      lbldiv = get_ext_element(:xpath, '//div/strong[text()=" Looking for members?"]/..')
      puts "lbldiv: #{lbldiv}"
      puts "text: #{lbldiv.text}"
      assert_equal(lstr, lbldiv.text)

      close_dialog
    end

    def nav_to_teams_looking_for_players
      nav_to_profile
      # lookingbutton = get_ext_element(:xpath, "//a[@href='/team/join?filter=recruiting']")
      lookingbutton = get_ext_element(:xpath, "//button[text()='Teams looking for players']")
      refute_nil lookingbutton
      lookingbutton.click
      sleep 0.5
      @cxn.save_screenshot('./ntllfp.png')
      f = get_ext_element(:xpath, '//h1[text()="Join a Team"]')
      #     f = match_source('Join a Team')
      refute_nil f
    end

    def team_card_names
      puts 'in team card names'
      cnlist = get_ext_elements(:xpath, '//div[@class="ui centered card"]/div[@class="content"]/div[@class="header"]')
      puts "cnlist: #{cnlist}"
      c = cnlist.map do |cn|
        cn.text
      end
      c 
    end

    def nav_to_players_looking_for_team
      nav_to_profile
      lookingbutton = get_ext_element(:xpath, "//button[text()='Players looking for teams']")
      refute_nil lookingbutton
      lookingbutton.click
      sleep 0.5
      @cxn.save_screenshot('./nplft.png')
      f = get_ext_element(:xpath, '//h1[text()="Players Looking for a Team"]')
      refute_nil f
    end

    def player_set_looking_for_team(looking, biotext)
      puts "pslft: looking #{looking} text #{biotext}"
      bio = get_ext_element(:name, 'bio')
      refute_nil bio
      puts "bio: #{bio}"
      puts 'clearing and updating bio'
      sleep 0.5
      bio.clear
      sleep 0.5
      bio.send_keys(biotext)
      sleep 0.5

      puts 'looking for toggle'
      lft = get_ext_element(:xpath, '//input[@name="lookingForTeam"]/..')
      refute_nil lft

      puts "set looking to: #{looking}"
      toggle_class = lft.attribute('class')
      puts "   current class: #{toggle_class}"
      if toggle_class.include?('checked')
        puts 'currently checked'
        if !looking
          puts('toggling looking off')
          lft.click
        end
      else
        puts 'not currently checked'
        if looking
          puts('toggling looking on')
          lft.click
        end
      end
      sleep 1

      puts "afterward, toggle class: #{lft.attribute('class')}"

      save = get_ext_element(:xpath, '//button[text()="Save"]')
      refute_nil save
      save.click
      sleep 1
    end

    def player_remove_team_member(teamname, fn, ln, em, should_succeed)
      player_nav_to_team(teamname)
      ucfn = upcase_first_letter(fn)
      ucln = upcase_first_letter(ln)
      cardname = get_ext_element(:xpath, "//div[normalize-space()='#{ucfn} #{ucln}']")
      refute_nil cardname
      remove = get_ext_element(:xpath, "//div[normalize-space()='#{ucfn} #{ucln}']/../..//button[text()='Remove']")
      refute_nil remove
      remove.click
      sleep 0.5
      accept_alert
      sleep 0.5
      if should_succeed
        # XXX add check here
      else
        assert match_source('You cannot remove yourself!')
      end
    end

    def change_password(newpw)
      puts "change password to: #{newpw}"
      nav_to('profile')
      pw1 = get_ext_element(:name, 'newPassword')
      puts "pw1: #{pw1}"
      refute_nil pw1
      pw2 = get_ext_element(:name, 'confirmPassword')
      puts "pw2: #{pw2}"
      refute_nil pw2
      pw1.clear
      pw2.clear
      pw1.send_keys(newpw)
      pw2.send_keys(newpw)
      sleep 2
      save = get_ext_element(:xpath, '//h3[normalize-space()="Change Password"]/..//button[text()="Save"]')
      puts "save: #{save}"
      refute_nil save
      save.click
      sleep 1
    end

    def change_password_2(newpw1, newpw2)
      puts "change password to: #{newpw1}, #{newpw2}"
      nav_to('profile')
      pw1 = get_ext_element(:name, 'newPassword')
      puts "pw1: #{pw1}"
      refute_nil pw1
      pw2 = get_ext_element(:name, 'confirmPassword')
      puts "pw2: #{pw2}"
      refute_nil pw2
      pw1.clear
      pw2.clear
      pw1.send_keys(newpw1)
      pw2.send_keys(newpw2)
      sleep 2
      save = get_ext_element(:xpath, '//h3[normalize-space()="Change Password"]/..//button[text()="Save"]')
      puts "save: #{save}"
      refute_nil save
      save.click
      sleep 1
    end

    def upcase_first_letter(s)
      fl = s[0]
      rest = s[1..]
      res = fl.upcase + rest
      res
    end

  end
end
