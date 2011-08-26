#
# Example usage: {% github_code https://github.com/heygrady/corners/blob/master/js/jquery-corners.js %}

require 'cgi'
require 'digest/md5'
require 'net/https'
require 'uri'
require './plugins/pygments_code'
require 'pathname'

module Jekyll
  class GithubCode < Liquid::Tag
    include HighlightCode
    def initialize(tag_name, text, token)
      super
      @text, @height  = text.split
      @cache_disabled = false
      @cache_folder   = File.expand_path "../_gist_cache", File.dirname(__FILE__)
      FileUtils.mkdir_p @cache_folder
    end

    def render(context)
      if parts = @text.match(/https:\/\/github.com\/(.*?)\/(.*?)\/blob\/(.*?)\/(.*)/)
        user, repo, branch, file  = parts[1].strip, parts[2].strip, parts[3].strip, parts[4].strip
        code = get_cached_gist(user, repo, branch, file) || get_gist_from_web(user, repo, branch, file)
        
        url      = get_gist_url_for user, repo, branch, file
        repo_url = get_repo_url_for user, repo, branch
        user_url = get_user_url_for user

        @filetype = File.extname(file).sub('.','')
        @filetype = 'objc' if @filetype == 'm'
        @filetype = 'perl' if @filetype == 'pl'
        title = @title ? "#{@title} #{File.basename(file)}" : File.basename(file)
        
        source = "<div><div class=\"gist\"><div class=\"gist-file\"><div class=\"gist-data gist-syntax\"" + (@height ? "style=\"height:#{@height}\"" : '') + ">#{highlight(code, @filetype)}</div><div class=\"gist-meta\"><a href='#{url}'>view raw</a><a href=\"#{@text}#file\" style=\"float:right;margin-right:10px;color:#666\">#{File.basename(file)}</a><a href=\"#{repo_url}\">From #{repo}</a> by <a href=\"#{user_url}\">#{user}</a></div></div></div></div>"
        source = source.sub('highlight','gist-highlight').sub(' #file"', '#file"')
        partial = Liquid::Template.parse(source)
        context.stack do
          partial.render(context)
        end
      else
        "Incorrect URL"
      end
    end

    def get_gist_url_for(user, repo, branch, file)
      "https://raw.github.com/#{user}/#{repo}/#{branch}/#{file}"
    end

    def get_repo_url_for(user, repo, branch)
      "https://github.com/#{user}/#{repo}/tree/#{branch}"
    end

    def get_user_url_for(user)
      "https://github.com/#{user}"
    end

    def cache(user, repo, branch, file, data)
      cache_file = get_cache_file_for user, repo, branch, file
      File.open(cache_file, "w") do |io|
        io.write data
      end
    end

    def get_cached_gist(user, repo, branch, file)
      return nil if @cache_disabled
      cache_file = get_cache_file_for user, repo, branch, file
      File.read cache_file if File.exist? cache_file
    end

    def get_cache_file_for(user, repo, branch, file)
      bad_chars = /[^a-zA-Z0-9\-_.]/
      user   = user.gsub bad_chars, ''
      repo   = repo.gsub bad_chars, ''
      branch = branch.gsub bad_chars, ''
      file   = file.gsub bad_chars, ''
      md5    = Digest::MD5.hexdigest "#{user}-#{repo}-#{branch}-#{file}"
      File.join @cache_folder, "#{user}-#{repo}-#{branch}-#{file}-#{md5}.cache"
    end

    def get_gist_from_web(user, repo, branch, file)
      gist_url          = get_gist_url_for user, repo, branch, file
      raw_uri           = URI.parse gist_url
      https             = Net::HTTP.new raw_uri.host, raw_uri.port
      https.use_ssl     = true
      https.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request           = Net::HTTP::Get.new raw_uri.request_uri
      data              = https.request request
      data              = data.body
      cache user, repo, branch, file, data unless @cache_disabled
      data
    end
  end
end

Liquid::Template.register_tag('github_code', Jekyll::GithubCode)
