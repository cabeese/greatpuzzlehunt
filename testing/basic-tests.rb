# frozen_string_literal: true

require 'minitest/spec'
require 'selenium-webdriver'
require_relative 'webutils'
require_relative 'config'

Minitest.seed = 1234

x = proc do |browser|
  describe "Basic access tests #{browser}" do
    include WebTestUtils
    
    before do
      set_base_url TESTCONFIG[:site]
      start_server browser
    end

    after do
      shutdown_server
    end

    it 'must load the GPH page' do
      nav_to_home
      assert(@wait.until do
               /Login/.match(@browser.page_source)
             end)
    end

    it 'must allow login' do
      nav_to_home
      b = @wait.until do
        e = @browser.find_element(:xpath, '//div/a[@href="/login"]')
        e
      end
      puts "found login: #{b}"
      puts "inspect: #{b.inspect}"
      puts "tag_name: #{b.tag_name}"
      puts "text: #{b.text}"
      puts "json: #{b.to_json}"
      puts "hash: #{b.hash}"
      # click_and_wait(b)
      b.click
      un = get_ext_element(:xpath, '//input[@name="email"]')
      pw = get_ext_element(:xpath, '//input[@name="password"]')
      sub = get_ext_element(:xpath, '//button[@type="submit"]')
      refute_nil un
      refute_nil pw
      refute_nil sub
      puts "found user name: text #{un.text}"
      puts "found password: text #{pw.text}"
      puts "found submission: text #{sub.text}"
      un.send_keys(TESTCONFIG[:adminuser])
      pw.send_keys(TESTCONFIG[:adminpw])
      sub.click
      head0 = get_ext_element(:xpath, '//h1')
      puts "head0: #{head0}"
      puts "head0 text: #{head0.text}"
      head1 = get_ext_element(:xpath, '//div[@class="ui container"]/div/h1')
      puts "head1: #{head1}"
      puts "head1 text: #{head1.text}"
      div2 = get_ext_element(:xpath, '//div[@class="ui container"]/div')
      puts "div2: #{div2}"
      puts "div2 text: #{div2.text}"
      header = @wait.until do
        # e = div2.find_element(:xpath, './h1[@text="Richard Golding"]')
        e = div2.find_element(:xpath, './h1')
        e
      end
      puts "found xpath header: #{header}"
      puts "xpath header text: #{header.text}"
      assert_includes(header.text, TESTCONFIG[:adminfullname])
    end

    it 'must log in admin' do
      nav_to_home
      succeed_login_as(TESTCONFIG[:adminuser], TESTCONFIG[:adminpw])
    end

    it 'must fail login with wrong password' do
      nav_to_home
      fail_login_as(TESTCONFIG[:adminuser], TESTCONFIG[:adminpw] + 'x')
    end
  end
end

each_browser x
