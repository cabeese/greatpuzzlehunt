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
  
  describe "Puzzle entry and edit #{browser}" do
    include WebTestUtils
    
    before do
      @reqbrowser = browser
      set_base_url TESTCONFIG[:site]
      start_server @reqbrowser
      @adminbrowser = Selenium::WebDriver.for @reqbrowser
      nav_to_home(@adminbrowser)
      succeed_login_as_admin(@adminbrowser)
    end

    after do
      @adminbrowser.quit
      shutdown_server
    end

    it 'navigates to puzzles page' do
      nav_to('admin/puzzles', @adminbrowser)
      h = get_ext_element(:xpath, '//h1', @adminbrowser)
      assert_equal(h.text, 'Puzzles')
    end

    it 'adds packet url' do
      nav_to('admin/puzzles', @adminbrowser)

      # check that we are on the puzzles page
      h = get_ext_element(:xpath, '//h1', @adminbrowser)
      assert_equal(h.text, 'Puzzles')

      # find the checkin entry field and save button
      ef = get_ext_element(:xpath, '//input[@name="url"]', @adminbrowser)
      refute_nil ef
      puts "got entry field: #{ef}"
      sv = get_ext_element(:xpath, '//button[text()="Save"]', @adminbrowser)
      refute_nil sv
      puts "got save button: #{sv}"

      # save it
      ef.clear
      ef.send_keys('this is an example')
      sv.click
      alert = @adminbrowser.switch_to.alert
      alert.accept
      
      # check status
      dl = get_ext_element(:xpath, '//a[@href="this is an example"]', @adminbrowser)
      refute_nil dl

      # clear the URL
      ef.clear
      sv.click
      alert = @adminbrowser.switch_to.alert
      alert.accept
    end

    # XXX need to be able to match up searches to make sure we are dealing
    # with the same puzzle every time
    it 'adds new puzzle' do
      nav_to('admin/puzzles', @adminbrowser)

      # check that we are on the puzzles page
      h = get_ext_element(:xpath, '//h1', @adminbrowser)
      assert_equal(h.text, 'Puzzles')

      # find the new puzzle button and click it
      np = get_ext_element(:xpath, '//button[text()="New Puzzle"]', @adminbrowser)
      refute_nil np
      puts "got new puzzle button: #{np}"
      np.click

      # check that a new puzzle now exists
      nplabel = get_ext_element(:xpath, '//div[text()="New Puzzle"]', @adminbrowser)
      refute_nil nplabel
      puts "got label: #{nplabel}"
      exclam = get_ext_element(:xpath, '//div/i[contains(@class, "exclamation")]', @adminbrowser)
      refute_nil exclam
      puts "got exclam: #{exclam}"
      edit = get_ext_element(:xpath, '//button[text()="Edit"]', @adminbrowser)
      refute_nil edit
      puts "got edit: #{edit}"
      del = get_ext_element(:xpath, '//button/i[contains(@class, "trash")]', @adminbrowser)

      # delete the new puzzle
      del.click
      alert = @adminbrowser.switch_to.alert
      alert.accept
      sleep 1

      # verify that the puzzle is gone
      assert_raises(Selenium::WebDriver::Error::NoSuchElementError) do
        @adminbrowser.find_element(:xpath, '//div[text()="New Puzzle"]')
      end
      assert_raises(Selenium::WebDriver::Error::NoSuchElementError) do
        @adminbrowser.find_element(:xpath, '//button/i[contains(@class, "trash")]')
      end
    end

    it 'adds two puzzles'

    it 'edits second puzzle'

  end

end

# Safari does not support opening two parallel sessions to 
each_browser x
