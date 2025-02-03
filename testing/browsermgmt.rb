# frozen_string_literal: true

require_relative 'connection'
require_relative 'webutils'

module WebTestUtils

  class Connections
    def initialize(browser, headless, baseurl)
      @browser = browser
      @headless = headless
      @baseurl = baseurl
      @ids = {}
    end

    def for(id)
      b = @ids[id]
      if b
        return b
      end

      @ids[id] = Connection.new(@browser, @headless, @baseurl)
    end

    def close(id)
      c = @ids[id]
      if c
        c.close
        @ids[id] = nil
      end
    end

    def close_all
      @ids.each_key do |id|
        close(id)
      end
    end

  end

end
