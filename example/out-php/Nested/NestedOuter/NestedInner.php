<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: nested.proto

namespace Nested\NestedOuter;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Generated from protobuf message <code>nested.NestedOuter.NestedInner</code>
 */
class NestedInner extends \Google\Protobuf\Internal\Message
{
    /**
     * Generated from protobuf field <code>string inner_name = 1;</code>
     */
    private $inner_name = '';

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type string $inner_name
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Nested::initOnce();
        parent::__construct($data);
    }

    /**
     * Generated from protobuf field <code>string inner_name = 1;</code>
     * @return string
     */
    public function getInnerName()
    {
        return $this->inner_name;
    }

    /**
     * Generated from protobuf field <code>string inner_name = 1;</code>
     * @param string $var
     * @return $this
     */
    public function setInnerName($var)
    {
        GPBUtil::checkString($var, True);
        $this->inner_name = $var;

        return $this;
    }

}

// Adding a class alias for backwards compatibility with the previous class name.
class_alias(NestedInner::class, \Nested\NestedOuter_NestedInner::class);

