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
      alert = browser.switch_to.alert
      alert.accept
    end
    
    # confirm virtual toggle state
    toggle_class_2 = toggle.attribute('class')
    ret = !toggle_class_2.include?('checked')
    puts "registration toggled on: #{ret}"
    
    ret
  end

end
