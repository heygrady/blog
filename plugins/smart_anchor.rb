
#
require './plugins/titlecase'

module Jekyll

  class SmartAnchorTag < Liquid::Tag
    @tag = nil
    @slug = nil
    @text = nil

    def initialize(tag_name, text, tokens)
      @tag = tag_name == "a" ? "a" : tag_name
      @text = text.strip! || text
      @slug = text.downcase.gsub(/&/,'and').gsub(/[,'":\?!\(\)\[\]]/,'').gsub(/[\W\.]/, '-').gsub(/-+$/,'')
      super
    end

    def render(context)
      output = super
      if @tag != "a"
        "<#{@tag} id=\"#{@slug}\">#{@text}</#{@tag}>"
      else
        "<#{@tag} id=\"#{@slug}\"></#{@tag}>"
      end
    end
  end
end

Liquid::Template.register_tag('h2', Jekyll::SmartAnchorTag)
Liquid::Template.register_tag('h3', Jekyll::SmartAnchorTag)
Liquid::Template.register_tag('h4', Jekyll::SmartAnchorTag)
Liquid::Template.register_tag('anchor', Jekyll::SmartAnchorTag)
