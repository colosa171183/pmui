require 'rubygems'

task :required do
    puts "Checking GEMs required..."
    isOk = true
    begin
        require 'json'
    rescue LoadError
        puts "JSON gem not found.\nInstall it by running 'gem install json'"
        isOk = false
    end
    begin
        require 'closure-compiler'
    rescue LoadError
        puts "closure-compiler gem not found.\nInstall it by running 'gem install closure-compiler'"
        isOk = false
    end
    begin
        require 'zip/zip'
        require 'zip/zipfilesystem'
    rescue LoadError
        puts "Zip Tools not found.\nInstall it by running 'gem install rubyzip -v 0.9.9'"
        isOk = false
    end
    if !isOk
        exit
    end
    puts "DONE"
end

task :dir do
    puts "Preparing Directories..."
    system "rm -rf build/"
    system "rm -rf docs/"
    system "rm -rf violations/"
    system "rm -rf dist/"
    Dir.mkdir('build') unless File.exists?('build')
    Dir.mkdir('build/js') unless File.exists?('build/js')
    Dir.mkdir('build/css') unless File.exists?('build/css')
    Dir.mkdir('build/img') unless File.exists?('build/img')
    Dir.mkdir('docs') unless File.exists?('docs')
    Dir.mkdir('violations') unless File.exists?('violations')
    Dir.mkdir('dist') unless File.exists?('dist')
    puts "DONE"
end

desc "Generates the project .js file"
task :js do
    puts "Generating necessary .js files..."
    Rake::Task['required'].execute

    buildConfig = File.read 'config/build.json'
    buildFiles = JSON.parse buildConfig 
    i = 0
    buildFiles.each do |bFile|

        extension = bFile['extension']
        name = bFile['name']
        if bFile['include_version'] 
            name += '-' + getVersion
        end
        write_path = bFile['target_path']
        buffer_file = ""
        sourceFiles = bFile['files']
        sourceFiles.each do |source|
            buffer_file += File.read source
            buffer_file += "\n"
        end
        if bFile['construct']
            puts "construct"
            base_path = bFile['construct']['base_file']
            replace_pattern = bFile['construct']['replace_pattern']
            base_file = File.read base_path
            buffer_file = base_file.gsub(replace_pattern, buffer_file)
            if bFile['construct']['version_pattern']
                buffer_file = buffer_file.gsub(bFile['construct']['version_pattern'], getVersion)
            end
        end
        fileName = write_path + name + '.' + extension
        File.open(fileName, 'w+') do |write_file|
            write_file.write buffer_file
        end
        puts "File: " + fileName + " has been generated correctly."
        if (bFile['minify'])
            write_path += 'min/'
            Dir.mkdir(write_path) unless File.exists?(write_path) 
            fileName = write_path + name + '.min.' + extension
            File.open(fileName, 'w+') do |write_file|
                write_file.write Closure::Compiler.new.compress(buffer_file)
            end
            puts "File: " + fileName + " has been generated correctly."
        end
        if bFile['copy_extra']
            copy_path = bFile['copy_extra']['target_path']
            Dir.mkdir(copy_path) unless File.exists?(copy_path)
            paths = bFile['copy_extra']['paths']
            paths.each do |path|
                system "cp -r " + path + " " + copy_path + "."
            end
        end
    end
    puts "DONE"
end

desc "Generates the stylesheet"
task :css => [:required] do
    puts "Generating necessary .css files..."
    cssConfig = File.read 'config/css.json'
    cssFiles = JSON.parse cssConfig
    i = 0
    cssFiles.each do |css|
        extension = css['extension']
        name = css['name']
        if css['include_version'] 
            name += '-' + getVersion
        end
        write_path = css['target_path']
        buffer_file = ""
        sourceFiles = css['files']
        sourceFiles.each do |source|
            buffer_file += File.read source
            buffer_file += "\n"
        end
        if css['construct']
            puts "constructing css..."
            base_path = css['construct']['base_file']
            replace_pattern = css['construct']['replace_pattern']
            base_file = File.read base_path
            buffer_file = base_file.gsub(replace_pattern, buffer_file)
            if css['construct']['version_pattern']
                buffer_file = buffer_file.gsub(css['construct']['version_pattern'], getVersion)
            end
        end
        fileName = write_path + name + '.' + extension
        File.open(fileName, 'w+') do |write_file|
            write_file.write buffer_file
        end
        puts "File: " + fileName + " has been generated correctly."
    end
    puts "DONE"
end

task :doc do
    docConfig = File.read 'config/docs.json'
    docs = JSON.parse(docConfig)
    docs.each do |doc_file|
        doc_list = ""
        doc_target = doc_file['build_dir']
        files = doc_file['files']
        files.each do |file|
            doc_list += " " + file
        end
        system "jsduck -o " + doc_target + doc_list
    end
end

task :package do
    zip_config = File.read 'config/dist.json'
    zips = JSON.parse(zip_config)
    zips.each do |zip|
        zip_path = zip['copy_to']
        fileName = zip['fileName']
        type = zip['type']
        version = getVersion
        archive = zip_path + fileName + "-" + version + "-" + type + ".zip";
        FileUtils.rm archive, :force=>true
        Zip::ZipFile.open(archive, 'w') do |zipfile|
            files = zip['files']
            files.each do |file|
                add_files = FileList.new(file)
                add_files.each do |afile|
                    zipfile.add(afile,afile)
                end
            end
            puts "File: " + archive + " has been created correctly!"
        end
    end
end

task :violations do
  Dir.mkdir('violations') unless File.exists?('violations')
  Dir.mkdir('violations/js') unless File.exists?('violations/js')
  Dir.mkdir('violations/css') unless File.exists?('violations/css')
  system "nodelint build/js/*.js --config config/jslint/jslint.js --reporter=xml > violations/js/jslint.xml"
  system "csslint build/css/*.css --format=checkstyle-xml > violations/css/checkstyle.xml"
  system "csslint build/css/*.css --format=lint-xml > violations/css/csslint.xml"
end

task :jasmine_ci do
  puts "Starting JASMINE testing..."
  system "jasmine-node spec/ --junitreport"
  puts "JASMINE testing...DONE"
end

desc "Run Jasmine Tests"
task :jasmine, :spec do |t, args| 
    if(args['spec'])
        system "jasmine-node --matchall --verbose spec/" + args["spec"] + '.spec.js'
    else
        system "jasmine-node --matchall --verbose spec"
    end
end

task :build_ci do
    Rake::Task['required'].execute
    Rake::Task['dir'].execute
    Rake::Task['js'].execute
    Rake::Task['css'].execute
    Rake::Task['doc'].execute
    Rake::Task['example'].execute
    Rake::Task['package'].execute
    Rake::Task['jasmine_ci'].execute
    Rake::Task['violations'].execute
end

desc "Set the library's version"
task :version, :version do |t,args|
    if (args['version'])
        File.open('VERSION.txt', 'w+') do |file|
            file.write args['version']
        end
    end
end

desc "Generate PMUI Files"
task :files do
    Rake::Task['required'].execute
    Rake::Task['dir'].execute
    Rake::Task['js'].execute
    Rake::Task['css'].execute
end


desc "Generate PMUI Documentation"
task :docs do
    Rake::Task['required'].execute
    Rake::Task['dir'].execute
    Rake::Task['doc'].execute
end

desc "Build the PMUI example"
task :example => [:js] do
    exampleConfig = File.read 'config/example.json'
    exampleFiles = JSON.parse exampleConfig
    directory = exampleFiles["copy_to"]
    from = exampleFiles["copy_from"]
    exampleFiles["files"].each do |file|
        html = File.read from + "/" + file
        html['##VERSION##'] = getVersion
        html['##APP##'] = getAppName
        html['##VERSION##'] = getVersion
        #html['##APP##'] = getAppName
        html['##VERSION##'] = getVersion    
        File.open(directory + "/" + file, 'w+') do |file|
            file.write html
        end
    end
    system "cp -f img/* build/img"
    puts "DONE"
end

desc "Build PMUI library"
task :build, :version do |t, args|
    if args['version']
        Rake::Task['version'].invoke(args['version'])
    end
    Rake::Task['required'].execute
    Rake::Task['dir'].execute
    Rake::Task['js'].execute
    Rake::Task['css'].execute
    Rake::Task['doc'].execute
    Rake::Task['example'].execute
    Rake::Task['package'].execute
    puts "PMUI " + getVersion + " has been build correctly."
end

desc "Default Task - Build Library"
task :default do
  Rake::Task['build'].execute
end

desc "Run JSLint tests"
task :jslint, :js do |t, args|
  if args['file']
    system "find src/ -name \"" + args['file'] + "\" -print0 | xargs -0 jslint --sloppy"
else
    system "find src/ -name \"*.js\" -print0 | xargs -0 jslint --sloppy"
end
end

task :get_version do
    puts "The version is: " + getVersion
end

def getVersion
    version = File.read 'VERSION.txt'
    return version
    exit
end

def getAppName
    appname = File.read 'APP.txt'
    return appname
    exit
end