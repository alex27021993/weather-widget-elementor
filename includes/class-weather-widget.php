<?php
use Elementor\Widget_Base;
use Elementor\Controls_Manager;
if ( ! defined( 'ABSPATH' ) ) { exit; }
class Weather_Widget extends Widget_Base {
    public function get_name() { return 'weather_widget'; }
    public function get_title() { return 'Weather Widget'; }
    public function get_icon() { return 'eicon-snow'; }
    public function get_categories() { return [ 'general' ]; }
    public function get_style_depends() { return [ 'weather-widget-css' ]; }
    public function get_script_depends() { return [ 'weather-widget-js' ]; }

    protected function register_controls() {
        $this->start_controls_section('content_section',[ 'label' => 'Настройки погоды' ]);
        $this->add_control('city',[ 'label' => 'Город', 'type' => Controls_Manager::TEXT, 'default' => 'Kyiv' ]);
        $this->add_control('api_key',[ 'label' => 'OpenWeather API Key', 'type' => Controls_Manager::TEXT ]);
        $this->add_control('units',[
            'label' => 'Единицы измерения',
            'type' => Controls_Manager::SELECT,
            'default' => 'metric',
            'options' => [ 'metric' => 'Цельсий (°C)', 'imperial' => 'Фаренгейт (°F)' ]
        ]);
        $this->add_control('show_details',[
            'label' => 'Показывать детали',
            'type' => Controls_Manager::SWITCHER,
            'label_on' => 'Да', 'label_off' => 'Нет',
            'return_value' => 'yes', 'default' => 'yes'
        ]);
        $this->end_controls_section();
    }

    protected function render() {
        $s = $this->get_settings_for_display();
        $city = isset($s['city']) ? esc_attr($s['city']) : '';
        $api_key = isset($s['api_key']) ? esc_attr($s['api_key']) : '';
        $units = isset($s['units']) ? esc_attr($s['units']) : 'metric';
        $details = (!empty($s['show_details']) && $s['show_details'] === 'yes') ? 'yes' : 'no';
        echo "<div class='weather-widget' data-city='{$city}' data-apikey='{$api_key}' data-units='{$units}' data-details='{$details}'>
                <div class='weather-loading'>Загрузка погоды...</div>
              </div>";
    }
}
