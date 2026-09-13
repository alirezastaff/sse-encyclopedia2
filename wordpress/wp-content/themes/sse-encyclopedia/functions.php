<?php
defined( 'ABSPATH' ) || exit;

function sse_theme_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list' ) );
    register_nav_menus( array( 'primary' => __( 'Primary Menu', 'sse-encyclopedia' ) ) );
}
add_action( 'after_setup_theme', 'sse_theme_setup' );

function sse_theme_assets() {
    wp_enqueue_style( 'sse-encyclopedia', get_stylesheet_uri(), array(), '0.1.0' );
    wp_enqueue_script( 'sse-encyclopedia', get_template_directory_uri() . '/assets/js/sse-reader.js', array(), '0.1.0', true );
    wp_localize_script( 'sse-encyclopedia', 'SSEReader', array(
        'restUrl' => esc_url_raw( rest_url( 'sse/v1/' ) ),
        'nonce'   => wp_create_nonce( 'wp_rest' ),
        'loginUrl' => wp_login_url( get_permalink() ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'sse_theme_assets' );

function sse_theme_language_class() {
    return function_exists( 'pll_current_language' ) && 'fa' === pll_current_language() ? 'sse-fa' : 'sse-en';
}
