<?php defined( 'ABSPATH' ) || exit; ?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body <?php body_class( sse_theme_language_class() ); ?>>
<?php wp_body_open(); ?>
<div class="sse-shell">
<header class="sse-header">
<a class="sse-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'SSE Encyclopedia', 'sse-encyclopedia' ); ?></a>
<nav class="sse-nav" aria-label="<?php esc_attr_e( 'Primary navigation', 'sse-encyclopedia' ); ?>">
<?php wp_nav_menu( array( 'theme_location' => 'primary', 'fallback_cb' => false, 'container' => false ) ); ?>
<a href="<?php echo esc_url( get_post_type_archive_link( 'sse_article' ) ); ?>"><?php esc_html_e( 'Archive', 'sse-encyclopedia' ); ?></a>
<?php foreach ( array( 'country-explorer' => 'Country Explorer', 'case-studies' => 'Case Studies', 'impact-calculator' => 'Impact Calculator', 'marginal-notes' => 'Marginal Notes' ) as $slug => $label ) : $page = get_page_by_path( $slug ); if ( $page ) : ?><a href="<?php echo esc_url( get_permalink( $page ) ); ?>"><?php echo esc_html( 'fa' === ( function_exists( 'pll_current_language' ) ? pll_current_language() : 'en' ) && 'marginal-notes' === $slug ? 'حاشیه نگار' : $label ); ?></a><?php endif; endforeach; ?>
<?php if ( is_user_logged_in() ) : ?><a href="<?php echo esc_url( get_permalink( get_page_by_path( 'profile' ) ) ); ?>"><?php esc_html_e( 'Profile', 'sse-encyclopedia' ); ?></a><?php else : ?><a href="<?php echo esc_url( wp_login_url() ); ?>"><?php esc_html_e( 'Login', 'sse-encyclopedia' ); ?></a><?php endif; ?>
<?php if ( function_exists( 'pll_the_languages' ) ) : ?><?php pll_the_languages( array( 'show_flags' => 0, 'show_names' => 1, 'dropdown' => 0 ) ); ?><?php endif; ?>
</nav>
</header>
<main class="sse-main">
