###------------------------------------------------------------------------###
###                 Simple script for building the index page              ###
###------------------------------------------------------------------------###

weeks = [*1..11]

Materials = Struct.new(
  :type,
  :subtype,
  :week,
  :link,
  :week_int

)

def makeMaterials(week, week_int, type, subtype)
  link = Dir["src/#{type}/#{week}/#{subtype}/index.html"][0]
  if link == nil
    return nil
  end
  if link.include?("src")
    link.gsub!(/src/,"")
  end 
  return Materials.new(
    type,
    subtype,
    week,
    link,
    week_int
  )
end

class Lecture
  def initialize(week)
    @week = '%02d' % week
    @week_int = week
    @subtypes = %w[slides handout]
    @type = 'lectures'
  end

  def listfiles
    @subtypes.flat_map {|subtype| makeMaterials(@week, @week_int, @type, subtype)}
  end
end

class Practical
  def initialize(week)
    @week = '%02d' % week
    @week_int = week
    @subtypes = %w[slides worksheets]
    @type = 'practicals'
  end

  def listfiles
    @subtypes.flat_map {|subtype| makeMaterials(@week, @week_int, @type, subtype)}
  end
end

class Tutorial
  def initialize(week)
    @week = '%02d' % week
    @week_int = week
    @subtypes = %w[tutorials]
    @type = 'tutorial'
  end

  def listfiles
    @subtypes.flat_map {|subtype| makeMaterials(@week, @week_int, @type, subtype)}
  end
end

lectureList = weeks.flat_map { |week| Lecture.new(week).listfiles }
lectureList.compact!

practicalList = weeks.flat_map { |week| Tutorial.new(week).listfiles }
practicalList.compact!

tutorialList = weeks.flat_map { |week| Practical.new(week).listfiles }
tutorialList.compact!

puts lectureList
puts practicalList
puts tutorialList
