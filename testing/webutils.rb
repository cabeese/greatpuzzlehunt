# frozen_string_literal: true

require_relative 'config.rb'

def each_browser(p)
  TESTCONFIG[:browsers].each do |b|
    p.call(b)
  end
end

module WebTestUtils

  def set_base_url(u)
    @baseurl = u
  end

  def start_server(browser, headless = false)
    if (browser == :firefox) && headless
      options = Selenium::WebDriver::Firefox::Options.new(args: ['-headless'])
      @browser = Selenium::WebDriver.for browser, options: options
    elsif (browser == :chrome) && headless
      options = Selenium::WebDriver::Chrome::Options.new(args: ['headless'])
      @browser = Selenium::WebDriver.for browser, options: options
    else
      @browser = Selenium::WebDriver.for browser
    end
    @wait = Selenium::WebDriver::Wait.new(:timeout => 10)
    @longwait = Selenium::WebDriver::Wait.new(:timeout => 30)
  end

  def shutdown_server
    @browser.quit
  end

  # Cause the browser to navigate to the home page (that is, the base
  # URL for the site).
  # 
  # Does a wait, polling on the top-level HTML element on the page
  # until it finds that the HTML element has been replaced in the DOM
  # in the browser.
  #
  # This appears to work correctly in single-page applications as well
  # as in traditional page-per-URL applications. Not sure why.
  def nav_to_home(browser = @browser)
    puts 'in nav_to_home'
    x = browser.find_element(:tag_name, 'html')
    puts "got old page element: #{x}"
    browser.get "#{@baseurl}/"
    puts 'waiting on home page load'
    @wait.until do
      puts '...polling'
      y = browser.find_element(:tag_name, 'html')
      puts "...got element #{y}"
      x != y
    end
    puts 'done with home page load'
  end

  def nav_to(path, browser = @browser)
    puts "in nav_to: #{path}"
    x = browser.find_element(:tag_name, 'html')
    puts "got old page element: #{x}"
    browser.get "#{@baseurl}/#{path}"
    puts 'waiting on page load'
    @wait.until do
      puts '...polling'
      y = browser.find_element(:tag_name, 'html')
      puts "...got element #{y}"
      x != y
    end
    puts 'done with page load'
  end

  # wait for a new page to load in the browser.  Note that after
  # calling click on a button or link in a page to go to a new page,
  # the timing of when the new page is loaded and when any calls to
  # watch things on the new page is undefined, and it is common to get
  # into race conditions.  This solution watches an element on the
  # previous page and polls until accessing it gets a stale reference
  # exception, which is an indication that a new page has been loaded
  # in the browser.
  #
  # This approach comes from
  # @http://www.obeythetestinggoat.com/how-to-get-selenium-to-wait-for-page-load-after-a-click.html@
  #
  # @param [Selenium::WebDriver::Element] element an element on the
  #    previous page that can be prodded to try to provoke a stale
  #    reference error
  #   def waitPageLoad(element)
  #     puts "waitpageload, element #{element}"
  #     @wait.until do
  #       begin
  #         puts '...polling for page load'
  #         element.find_element(:id, 'x')
  #         false
  #       rescue Selenium::WebDriver::Error::StaleElementReferenceError => e
  #         puts '...got stale reference'
  #         true
  #       end
  #     end
  #   end

  # def click_and_wait(element)
  #   x = @browser.find_element(:tag_name, 'html')
  #   element.click
  #   @wait.until do
  #     puts '...polling'
  #     y = @browser.find_element(:tag_name, 'html')
  #     puts "...got element #{y}"
  #     x != y
  #   end
  # end

  # def send_and_wait(element, content)
  #   x = @browser.find_element(:tag_name, 'html')
  #   element.send_keys(content)
  #   @wait.until do
  #     puts '...polling'
  #     y = @browser.find_element(:tag_name, 'html')
  #     puts "...got element #{y}"
  #     x != y
  #   end
  # end

  def get_element(x, browser = @browser)
    @wait.until do
      e = browser.find_element(x)
      e
    end
  end

  def get_ext_element(m, x, browser = @browser)
    @wait.until do
      e = browser.find_element(m, x)
      e
    end
  end

  def get_sub_element(fromelement, m, x)
    @wait.until do
      e = fromelement.find_element(m, x)
      e
    end
  end

  def match_source(str, browser = @browser)
    @wait.until do
      browser.page_source.include?(str)
    end
  end

  ########################################
  # Various GPH navigation common behaviors

  def login_as(userarg, pwarg, browser = @browser)
    puts "login as #{userarg}, pw #{pwarg}, #{browser}"
    b = @wait.until do
      e = browser.find_element(:xpath, '//div/a[@href="/login"]')
      e
    end
    b.click
    un = get_ext_element(:xpath, '//input[@name="email"]', browser)
    pw = get_ext_element(:xpath, '//input[@name="password"]', browser)
    sub = get_ext_element(:xpath, '//button[@type="submit"]', browser)
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

  def succeed_login_as(user, pw, browser = @browser)
    login_as(user, pw, browser)

    # check that now on the user page
    match_source('Last Updated', browser)
  end

  def fail_login_as(user, pw, browser = @browser)
    login_as(user, pw, browser)

    # check that still on the login screen
    match_source('Incorrect password', browser)
  end

  def login_as_admin(browser = @browser)
    puts "login as admin, #{browser}"
    login_as(TESTCONFIG[:adminuser], TESTCONFIG[:adminpw], browser)
  end

  def succeed_login_as_admin(browser = @browser)
    login_as_admin(browser)
    match_source('Last Updated', browser)
    match_source(TESTCONFIG[:adminfullname], browser)
    match_source('Admin', browser)
  end    

  def fail_login_as_admin(browser = @browser)
    login_as_admin(browser)
    match_source('Incorrect password', browser)
  end    

  ##################################################
  # User registration helpers

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
      @browser.action.send_keys(:tab).perform
      if accttypearg == :nonstudent
        @browser.action.send_keys(:down).perform
      elsif accttypearg == :volunteer
        @browser.action.send_keys(:down).perform
        @browser.action.send_keys(:down).perform
      end
      @browser.action.send_keys(:space).perform
    end

    unless pw1arg.nil?
      pw.send_keys(pw1arg)
    end
    unless pw2arg.nil?
      pw2.send_keys(pw2arg)
    end

    unless gamemode.nil?
      @browser.action.send_keys(:tab).perform
      if gamemode == :inperson
        @browser.action.send_keys(:down).perform
      elsif gamemode == :virtual
        @browser.action.send_keys(:down).perform
        @browser.action.send_keys(:down).perform
      end
      @browser.action.send_keys(:space).perform
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

  # @return [Array<String, String, String>] array of random strings for
  #    first name, last name, and email
  def gen_random_id
    [SecureRandom.alphanumeric(8), SecureRandom.alphanumeric(8),
     "#{SecureRandom.alphanumeric(6)}@#{SecureRandom.alphanumeric(8)}.net"]
  end

end
