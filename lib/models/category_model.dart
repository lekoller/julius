import 'package:flutter/material.dart';

class CategoryModel {
  String name;
  String iconPath;
  Color boxColor;

  CategoryModel(
      {required this.name, required this.iconPath, required this.boxColor});

  static List<CategoryModel> getCategories() {
    List<CategoryModel> categories = [];

    categories.add(CategoryModel(
        name: 'Salad',
        iconPath: 'assets/icons/plate.svg',
        boxColor: const Color(0xffFFD2D2)));

    categories.add(CategoryModel(
        name: 'Cake',
        iconPath: 'assets/icons/pancakes.svg',
        boxColor: const Color(0xffD2E3FF)));

    categories.add(CategoryModel(
        name: 'Pie',
        iconPath: 'assets/icons/pie.svg',
        boxColor: const Color(0xffFFF4D2)));

    // categories.add(CategoryModel(
    //     name: 'Fruit',
    //     iconPath: 'assets/icons/fruit.svg',
    //     boxColor: const Color(0xffD2FFD5)));

    categories.add(CategoryModel(
        name: 'Smoothies',
        iconPath: 'assets/icons/orange-snacks.svg',
        boxColor: const Color(0xffFFD2E3)));

    return categories;
  }
}
