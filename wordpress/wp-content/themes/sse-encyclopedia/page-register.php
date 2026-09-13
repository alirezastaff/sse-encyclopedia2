<?php
/* Template Name: SSE Register */
if ( is_user_logged_in() ) {
	wp_safe_redirect( home_url( '/profile/' ) );
	exit;
}
$error = '';
if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) {
	if ( ! isset( $_POST['sse_register_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['sse_register_nonce'] ) ), 'sse_register' ) ) {
		$error = __( 'Security check failed.', 'sse-encyclopedia' );
	} else {
		$name = sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) );
		$email = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
		$password = (string) ( $_POST['password'] ?? '' );
		if ( '' === $name || ! is_email( $email ) || strlen( $password ) < 6 ) {
			$error = __( 'Enter a name, valid email, and password of at least six characters.', 'sse-encyclopedia' );
		} elseif ( email_exists( $email ) ) {
			$error = __( 'An account already exists with this email.', 'sse-encyclopedia' );
		} else {
			$user_id = wp_create_user( sanitize_user( current( explode( '@', $email ) ), true ), $password, $email );
			if ( is_wp_error( $user_id ) ) {
				$error = $user_id->get_error_message();
			} else {
				wp_update_user( array( 'ID' => $user_id, 'display_name' => $name ) );
				wp_set_auth_cookie( $user_id );
				wp_safe_redirect( home_url( '/profile/' ) );
				exit;
			}
		}
	}
}
get_header();
?>
<section class="sse-card sse-auth-card">
<h1><?php esc_html_e( 'Create an account', 'sse-encyclopedia' ); ?></h1>
<?php if ( $error ) : ?><p class="sse-error"><?php echo esc_html( $error ); ?></p><?php endif; ?>
<form method="post">
<?php wp_nonce_field( 'sse_register', 'sse_register_nonce' ); ?>
<p><label for="sse-name"><?php esc_html_e( 'Name', 'sse-encyclopedia' ); ?></label><input id="sse-name" name="name" type="text" required></p>
<p><label for="sse-email"><?php esc_html_e( 'Email', 'sse-encyclopedia' ); ?></label><input id="sse-email" name="email" type="email" required></p>
<p><label for="sse-password"><?php esc_html_e( 'Password', 'sse-encyclopedia' ); ?></label><input id="sse-password" name="password" type="password" minlength="6" required></p>
<button class="sse-button" type="submit"><?php esc_html_e( 'Create account', 'sse-encyclopedia' ); ?></button>
</form>
</section>
<?php get_footer();
