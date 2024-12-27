# frozen_string_literal: true

require_relative 'webutils'
require_relative 'config'

module WebTestUtils

  def close_admin
    if @adminbrowser
      @adminbrowser.quit
    end
  end

  def get_default_admin
    if @adminbrowser.nil?
      @adminbrowser = Selenium::WebDriver.for @reqbrowser
      nav_to_home(@adminbrowser)
      succeed_login_as_admin(@adminbrowser)
    end

    @adminbrowser
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
    puts "registration toggled on: #{ret}"
    
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
    puts "registration toggled on: #{ret}"
    
    ret
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
