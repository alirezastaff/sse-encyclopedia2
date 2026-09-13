<?php if ( post_password_required() ) return; ?>
<section id="comments" class="sse-card">
<h2><?php esc_html_e( 'Marginal notes', 'sse-encyclopedia' ); ?></h2>
<?php if ( have_comments() ) : ?><ol><?php wp_list_comments( array( 'style' => 'ol', 'type' => 'sse_public_note' ) ); ?></ol><?php endif; ?>
<?php comment_form( array( 'title_reply' => __( 'Add a public note', 'sse-encyclopedia' ), 'comment_field' => '<p class="comment-form-comment"><label for="comment">' . esc_html__( 'Note', 'sse-encyclopedia' ) . '</label><textarea id="comment" name="comment" required></textarea></p><input type="hidden" name="comment_type" value="sse_public_note">' ) ); ?>
</section>
