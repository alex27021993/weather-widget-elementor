<?php
/**
 * Plugin Name: Weather Widget for Elementor
 * Description: Кастомный виджет прогноза погоды для Elementor (OpenWeatherMap API)
 * Version: 1.1.0
 * Author: Alex Abashyn
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
add_action( 'elementor/widgets/register', function( $widgets_manager ) {
    require_once __DIR__ . '/includes/class-weather-widget.php';
    $widgets_manager->register( new \Weather_Widget() );
} );
add_action( 'wp_enqueue_scripts', function() {
    $css_path = plugin_dir_path( __FILE__ ) . 'weather-widget.css';
    $css_ver  = file_exists( $css_path ) ? filemtime( $css_path ) : '1.1.0';
    wp_register_style('weather-widget-css', plugin_dir_url( __FILE__ ) . 'weather-widget.css', [], $css_ver);
    wp_register_script('weather-widget-js', plugin_dir_url( __FILE__ ) . 'weather-widget.js', ['jquery'], '1.1.0', true);
});
