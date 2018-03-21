require_relative 'analytics'
require_relative 'analytics_data'

module Poe
  module Sniper
    class Encapsulators
      include EasyLogging

      def self.exception_handling(analytics: true)
        begin
          yield if block_given?
        rescue Exception => e
          Analytics.instance.track(event: 'Exception occured', properties: AnalyticsData.exception(e)) if analytics
          Analytics.instance.flush if analytics
          logger.error(ruby_style_trace(e))
        end
      end

      def self.user_interaction_before(event)
        begin
          yield if block_given?
        ensure
          logger.info("Press any key to #{event}")
          gets
        end
      end

      private

      def self.ruby_style_trace(exception)
        exception.backtrace.join("\n\t").sub("\n\t", ": #{exception}#{exception.class ? " (#{exception.class})" : ''}\n\t")
      end
    end
  end
end
