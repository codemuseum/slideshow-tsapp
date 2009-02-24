class CreateSlides < ActiveRecord::Migration
  def self.up
    create_table :slides do |t|
      t.references :page_object
      t.string :asset_urn
      t.string :asset_type
      t.integer :position
      t.text :title
      t.string :title_placement
      t.string :link

      t.timestamps
    end
    add_index :slides, :page_object_id
    add_index :slides, :asset_urn
    add_index :slides, :position
  end

  def self.down
    drop_table :slides
  end
end
