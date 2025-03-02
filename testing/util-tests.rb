# frozen_string_literal: true

require 'minitest/spec'
require 'securerandom'

require_relative 'config'
require_relative 'webutils'

describe "utility tests" do
  include WebTestUtils
  
  before do
    # @reqbrowser = browser
    # set_base_url TESTCONFIG[:site]
    # start_server(@reqbrowser, false, true, true)
    # turn_on_registration(@adminbrowser)
  end
  
  after do
    # turn_off_registration(@adminbrowser)
    # shutdown_server
  end
  
  it 'upcases first letters correctly' do
    assert_equal('Abcd', upcase_first_letter('Abcd'))
    assert_equal('Abcd', upcase_first_letter('abcd'))
    assert_equal('ABCD', upcase_first_letter('ABCD'))
    assert_equal('1abcd', upcase_first_letter('1abcd'))
    assert_equal('Vabc def', upcase_first_letter('vabc def'))
  end

end
