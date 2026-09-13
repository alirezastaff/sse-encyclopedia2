<?php
/* Template Name: SSE Profile */
get_header();
if ( ! is_user_logged_in() ) : ?>
<section class="sse-card">
<h1><?php esc_html_e( 'Profile', 'sse-encyclopedia' ); ?></h1>
<p><?php esc_html_e( 'Sign in to view your saved reading data.', 'sse-encyclopedia' ); ?></p>
<a class="sse-button" href="<?php echo esc_url( wp_login_url( get_permalink() ) ); ?>"><?php esc_html_e( 'Sign in', 'sse-encyclopedia' ); ?></a>
</section>
<?php else :
global $wpdb;
$user_id = get_current_user_id();
$bookmarks = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . sse_encyclopedia_table( 'bookmarks' ) . ' WHERE user_id = %d ORDER BY created_at DESC', $user_id ) );
$reading = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . sse_encyclopedia_table( 'reading_list' ) . ' WHERE user_id = %d ORDER BY updated_at DESC', $user_id ) );
$notes = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . sse_encyclopedia_table( 'private_notes' ) . ' WHERE user_id = %d ORDER BY updated_at DESC', $user_id ) );
?>
<section class="sse-hero"><h1><?php esc_html_e( 'Profile', 'sse-encyclopedia' ); ?></h1><p><?php echo esc_html( wp_get_current_user()->display_name ); ?></p></section>
<section class="sse-grid">
<div class="sse-card"><h2><?php esc_html_e( 'Bookmarks', 'sse-encyclopedia' ); ?></h2><ul><?php foreach ( $bookmarks as $item ) : ?><li><a href="<?php echo esc_url( get_permalink( (int) $item->article_id ) ); ?>"><?php echo esc_html( get_the_title( (int) $item->article_id ) ); ?></a></li><?php endforeach; ?></ul></div>
<div class="sse-card"><h2><?php esc_html_e( 'Reading list', 'sse-encyclopedia' ); ?></h2><ul><?php foreach ( $reading as $item ) : ?><li><a href="<?php echo esc_url( get_permalink( (int) $item->article_id ) ); ?>"><?php echo esc_html( get_the_title( (int) $item->article_id ) ); ?></a> <small><?php echo esc_html( $item->status ); ?></small></li><?php endforeach; ?></ul></div>
<div class="sse-card"><h2><?php esc_html_e( 'Private notes', 'sse-encyclopedia' ); ?></h2><ul><?php foreach ( $notes as $item ) : ?><li><?php echo esc_html( wp_trim_words( $item->content, 24 ) ); ?></li><?php endforeach; ?></ul></div>
</section>
<?php endif; get_footer();
