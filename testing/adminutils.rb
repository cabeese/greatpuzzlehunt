# frozen_string_literal: true

require_relative 'webutils'
require_relative 'config'

module WebTestUtils

  def get_default_admin
    @connections.for('admin').cxn
  end

  def turn_on_registration(browser = nil)
    puts 'admin: turn on registration'

    if browser.nil?
      browser = get_default_admin
    end

    # go to the game control page
    nav_to('admin/gamestate', browser)
    
    # find in-person registration toggle
    toggle = get_ext_element(:xpath, '//div/label[text()="In-Person Registration"]/..', browser)
    puts "got toggle div: #{toggle}"
    
    # if not checked, click it and then confirm the popup alert
    toggle_class = toggle.attribute('class')
    unless toggle_class.include?('checked')
      puts('toggling registration')
      toggle.click
      sleep 1
      alert = browser.switch_to.alert
      alert.accept
    end
    
    # confirm in person toggle is checked
    toggle_class_2 = toggle.attribute('class')
    ret = toggle_class_2.include?('checked')
    puts "registration toggled on: #{ret}"
    
    # find virtual registration toggle
    toggle = get_ext_element(:xpath, '//div/label[text()="Virtual Registration"]/..', browser)
    puts "got toggle div: #{toggle}"
    
    # if not checked, click it and then confirm the popup alert
    toggle_class = toggle.attribute('class')
    unless toggle_class.include?('checked')
      puts('toggling registration')
      toggle.click
      sleep 1
      alert = browser.switch_to.alert
      alert.accept
    end
    
    # confirm virtual toggle is checked
    toggle_class_2 = toggle.attribute('class')
    ret = toggle_class_2.include?('checked')
    puts "registration toggled on: #{ret}"
    
    ret
  end
  
  def turn_off_registration(browser = nil)
    puts 'admin: turn off registration'

    if browser.nil?
      browser = get_default_admin
    end
    
    # go to the game control page
    nav_to('admin/gamestate', browser)
    
    # find in-person registration toggle
    toggle = get_ext_element(:xpath, '//div/label[text()="In-Person Registration"]/..', browser)
    puts "got toggle div: #{toggle}"
    
    # if checked, click it and then confirm the popup alert
    toggle_class = toggle.attribute('class')
    if toggle_class.include?('checked')
      puts('toggling registration')
      toggle.click
      sleep 1
      alert = browser.switch_to.alert
      alert.accept
    end
    
    # confirm in-person toggle state
    toggle_class_2 = toggle.attribute('class')
    ret = !toggle_class_2.include?('checked')
    puts "registration toggled off: #{ret}"
    
    # find virtual registration toggle
    toggle = get_ext_element(:xpath, '//div/label[text()="Virtual Registration"]/..', browser)
    puts "got toggle div: #{toggle}"
    
    # if checked, click it and then confirm the popup alert
    toggle_class = toggle.attribute('class')
    if toggle_class.include?('checked')
      puts('toggling registration')
      toggle.click
      sleep 1
      alert = browser.switch_to.alert
      alert.accept
    end
    
    # confirm virtual toggle state
    toggle_class_2 = toggle.attribute('class')
    ret = !toggle_class_2.include?('checked')
    puts "registration toggled off: #{ret}"
    
    ret
  end

  def verify_user_email(email, browser = nil)
    if browser.nil?
      browser = get_default_admin
    end

    nav_to('admin/users', browser)
    sleep 0.5

    morebutton = get_ext_element(:xpath, "//td/span[text()='#{email}']/../../td/button[text()='More']", browser)
    morebutton.click
    sleep 0.5
    
    # make sure that we have the details modal up
    f = match_source('Player Details', browser)
    puts "player details: #{f}"
    refute_nil f
    
    # verify the email address
    verifybutton = get_ext_element(:xpath, '//button[text()="Verify Email"]', browser)
    puts "verify button: #{verifybutton} text: #{verifybutton.text}"
    verifybutton.click
    sleep 0.5

    # close the modal
    closeicon = get_ext_element(:xpath, '//div/i[contains(@class, "close")]', browser)
    puts "modal close: #{closeicon} text: #{closeicon.text}"
    closeicon.click
    sleep 0.5
  end

  def delete_test_users(marker, browser = nil)
    if browser.nil?
      browser = get_default_admin
    end

    nav_to('admin/users', browser)
    sleep 0.5
    
    buttons = browser.find_elements(:xpath, '//button[text()="More"]')
    puts "found #{buttons.length} more buttons on users admin page"
    if buttons.length == 0
      puts 'found no more buttons'
      browser.save_screenshot('./cleanup-no-more-buttons.png')
    end
    buttons.each do |button|
      puts "...clicking on #{button}"
      begin
        browser.save_screenshot('./preclickmore.png')
        button.click
        sleep 0.5
        if browser.page_source.include?(marker)
          puts 'user has city marker, deleting'
          delete_button = browser.find_element(:xpath, '//div[@class="actions"]/div/button[last()]')
          begin
            delete_button.click
            sleep 0.5
          rescue Selenium::WebDriver::Error::ElementClickInterceptedError => e
            puts 'unable to delete; click intercepted error'
            puts "exception: #{e}"
            puts "backtrace: #{e.backtrace}"
            browser.save_screenshot('./clickintercept.png')
          end
          alert = browser.switch_to.alert
          unless alert.text.downcase.include? 'confirm delete '
            browser.save_screenshot('./unknownalert.png')
            raise 'unknown alert while deleting users'
          end
          alert.accept
        else
          # just close the modal
          puts 'user does not have city marker, not deleting'
          closebutton = get_ext_element(:xpath, '//div/div/i[@class="close icon"]', @browser)
          closebutton.click
        end

        found = true
        t = Time.now
        while found
          if Time.now > (t + 30.0)
            browser.save_screenshot('./player-dialog-not-gone.png')
            raise 'Player dialog is not going away'
          end
          puts 'polling until player details dialog goes away'
          found = browser.page_source.include?('Player Details')
          sleep 0.1
        end
      rescue Selenium::WebDriver::Error::ElementClickInterceptedError => e
        puts "got click intercepted in cleanup: #{e}"
        puts "backtrace: #{e.backtrace}"
        browser.save_screenshot('./clickintercept2.png')
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

  # when on the puzzles admin page, return a list of the puzzle ids
  # currently on there
  def find_current_puzzles(browser = nil)
    if browser.nil?
      browser = get_default_admin
    end

    puzdiv = get_ext_element(:xpath, '//h3[text()="Puzzles"]/../../..', browser)
    puts "got puzzle div: #{puzdiv}"
    puts "text: #{puzdiv.text}"
    puzzles = get_sub_elements(puzdiv, :xpath, '//div[@name]')
    puts "got puzzles: #{puzzles}"
    puzzles
  end

  def find_current_puzzle_ids(browser = nil)
    puzzles = find_current_puzzles(browser)
    res = []
    puzzles.each do |pdiv|
      res << pdiv.attribute('name')
    end
    res
  end

  def delete_puzzle(id, browser = nil)
    if browser.nil?
      browser = get_default_admin
    end

    del = get_ext_element(:xpath, "//div[@name=\"#{id}\"]//button/i[contains(@class, \"trash\")]/..", browser)
    del.click
    sleep 1
    alert = browser.switch_to.alert
    alert.accept
  end

  def open_edit_puzzle(id, browser = nil)
    if browser.nil?
      browser = get_default_admin
    end

    refute(browser.page_source.include?('Puzzle Editor'))

    edit = get_ext_element(:xpath, "//div[@name=\"#{id}\"]//button[text()='Edit']", browser)
    edit.click
    sleep 1

    match_source('Puzzle Editor', browser)
  end

  def enter_puzzle_info(pname, answer, stage, allowed, timeout, bonus, location, download, hint0text, hint0url, hint1text, hint1url, hint2text, hint2url, browser = nil)
    if browser.nil?
      browser = get_default_admin
    end
    
    enter_field('name', pname, browser)
    enter_field('answer', answer, browser)
    
    enter_field('stage', stage, browser)
    enter_field('allowedTime', allowed, browser)
    enter_field('timeoutScore', timeout, browser)
    enter_field('bonusTime', bonus, browser)

    enter_field('location', location, browser)
    enter_field('downloadURL', download, browser)

    enter_field('hint_0_text', hint0text, browser)
    enter_field('hint_0_imageUrl', hint0url, browser)
    enter_field('hint_1_text', hint1text, browser)
    enter_field('hint_1_imageUrl', hint1url, browser)
    enter_field('hint_2_text', hint2text, browser)
    enter_field('hint_2_imageUrl', hint2url, browser)
  end

  def save_puzzle_info(browser = nil)
    if browser.nil?
      browser = get_default_admin
    end

    save_button = get_ext_element(:xpath, '//h3[text()="Puzzle Editor"]/..//button[text()="Save"]', browser)
    refute_nil save_button

    puts "got save button: #{save_button}"
    
    save_button.click
    sleep 1
    alert = browser.switch_to.alert
    alert.accept
  end

  def close_puzzle_editor(browser = nil)
    if browser.nil?
      browser = get_default_admin
    end

    close_button = get_ext_element(:xpath, '//h3[text()="Puzzle Editor"]/..//button[text()="Close"]', browser)
    close_button.click
    sleep 1
  end

end
