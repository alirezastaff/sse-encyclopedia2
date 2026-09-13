<?php
/* Template Name: SSE Login */
get_header();
?>
<section class="sse-card sse-auth-card">
<h1><?php esc_html_e( 'Sign in', 'sse-encyclopedia' ); ?></h1>
<?php wp_login_form( array( 'redirect' => home_url( '/profile/' ), 'remember' => true ) ); ?>
<p><a href="<?php echo esc_url( wp_lostpassword_url() ); ?>"><?php esc_html_e( 'Forgot your password?', 'sse-encyclopedia' ); ?></a></p>
<?php if ( get_option( 'users_can_register' ) ) : ?><p><a href="<?php echo esc_url( home_url( '/register/' ) ); ?>"><?php esc_html_e( 'Create an account', 'sse-encyclopedia' ); ?></a></p><?php endif; ?>
</section>
<?php get_footer();
