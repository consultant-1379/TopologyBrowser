#!/bin/bash

pomFile="./pom.xml"

original_node=$(grep -m1 -oP '(?<=<node>).*?(?=</node>)' "$pomFile")
original_npm=$(grep -m1 -oP '(?<=<npm>).*?(?=</npm>)' "$pomFile")
original_cdtServe=$(grep -m1 -oP '(?<=<cdt-serve>).*?(?=</cdt-serve>)' "$pomFile")
original_cdtPackage=$(grep -m1 -oP '(?<=<cdt-package>).*?(?=</cdt-package>)' "$pomFile")
original_cdtBuild=$(grep -m1 -oP '(?<=<cdt-build>).*?(?=</cdt-build>)' "$pomFile")

new_node=$(whereis node | awk '{print $2}')
new_npm=$(whereis npm | awk '{print $2}')
new_cdtServe=$(whereis cdt-serve | awk '{print $2}')
new_cdtPackage=$(whereis cdt-package | awk '{print $2}')
new_cdtBuild=$(whereis cdt-build | awk '{print $2}')

sed -i "0,/<node>.*<\/node>/s|<node>.*<\/node>|<node>$new_node<\/node>|" "$pomFile"
sed -i "0,/<npm>.*<\/npm>/s|<npm>.*<\/npm>|<npm>$new_npm<\/npm>|" "$pomFile"
sed -i "0,/<cdt-serve>.*<\/cdt-serve>/s|<cdt-serve>.*<\/cdt-serve>|<cdt-serve>$new_cdtServe<\/cdt-serve>|" "$pomFile"
sed -i "0,/<cdt-package>.*<\/cdt-package>/s|<cdt-package>.*<\/cdt-package>|<cdt-package>$new_cdtPackage<\/cdt-package>|" "$pomFile"
sed -i "0,/<cdt-build>.*<\/cdt-build>/s|<cdt-build>.*<\/cdt-build>|<cdt-build>$new_cdtBuild<\/cdt-build>|" "$pomFile"

echo "Properties replaced:"
echo "node: $original_node -> $new_node"
echo "npm: $original_npm ->  $new_npm"
echo "cdt-build: $original_cdtBuild -> $new_cdtBuild"
echo "cdt-serve: $original_cdtServe -> $new_cdtServe"
echo "cdt-package: $original_cdtPackage -> $new_cdtPackage"

mvn clean package

sed -i "0,/<node>.*<\/node>/s|<node>.*<\/node>|<node>$original_node<\/node>|" "$pomFile"
sed -i "0,/<npm>.*<\/npm>/s|<npm>.*<\/npm>|<npm>$original_npm<\/npm>|" "$pomFile"
sed -i "0,/<cdt-serve>.*<\/cdt-serve>/s|<cdt-serve>.*<\/cdt-serve>|<cdt-serve>$original_cdtServe<\/cdt-serve>|" "$pomFile"
sed -i "0,/<cdt-package>.*<\/cdt-package>/s|<cdt-package>.*<\/cdt-package>|<cdt-package>$original_cdtPackage<\/cdt-package>|" "$pomFile"
sed -i "0,/<cdt-build>.*<\/cdt-build>/s|<cdt-build>.*<\/cdt-build>|<cdt-build>$original_cdtBuild<\/cdt-build>|" "$pomFile"

echo "Original values restored in the pom file."
echo "The produced rpm is located ./ERICtopologybrowser_CXP9030753/target/rpm/ERICtopologybrowser_CXP9030753/RPMS/noarch"
