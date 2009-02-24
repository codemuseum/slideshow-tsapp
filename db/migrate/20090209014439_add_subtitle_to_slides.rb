class AddSubtitleToSlides < ActiveRecord::Migration
  def self.up
    add_column :slides, :subtitle, :text
  end

  def self.down
    remove_column :slides, :subtitle
  end
end
